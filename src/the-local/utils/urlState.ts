import { DEFAULT_CENTER, DEFAULT_ZOOM } from "../constants";
import type { MapViewState, QueryFilters } from "../types/filters";

interface ParsedState {
  mapView: MapViewState;
  filters: QueryFilters;
}

function parseNumberParam(
  value: string | null,
  fallback: number,
  validate: (n: number) => boolean,
): number {
  if (value === null) return fallback;
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || !validate(parsed)) return fallback;
  return parsed;
}

function parseLimit(params: URLSearchParams): Pick<QueryFilters, "limit"> {
  const rawLimit = params.get("limit");
  if (!rawLimit || rawLimit.trim() === "") {
    return { limit: null };
  }

  const parsed = Number(rawLimit.trim());
  if (!Number.isInteger(parsed) || parsed < 1) {
    return { limit: null };
  }

  return { limit: parsed };
}

function parseBoroughIds(raw: string | null): string[] {
  if (!raw) return [];

  const seen = new Set<string>();
  return raw
    .split(",")
    .map((id) => id.trim())
    .filter((id) => id.length > 0)
    .filter((id) => {
      if (seen.has(id)) return false;
      seen.add(id);
      return true;
    });
}

export function parseStateFromSearch(search: string): ParsedState {
  const params = new URLSearchParams(search);
  const { limit } = parseLimit(params);

  const mapView: MapViewState = {
    lat: parseNumberParam(params.get("lat"), DEFAULT_CENTER[0], (n) => n >= -90 && n <= 90),
    lng: parseNumberParam(params.get("lng"), DEFAULT_CENTER[1], (n) => n >= -180 && n <= 180),
    zoom: parseNumberParam(params.get("z"), DEFAULT_ZOOM, (n) => n >= 1 && n <= 22),
  };

  const filters: QueryFilters = {
    limit,
    selectedBoroughIds: parseBoroughIds(params.get("boroughs")),
  };

  return { mapView, filters };
}

/** For React Router `setSearchParams`. */
export function buildSearchParamsFromState(
  mapView: MapViewState,
  filters: QueryFilters,
): URLSearchParams {
  const params = new URLSearchParams();
  params.set("lat", mapView.lat.toFixed(6));
  params.set("lng", mapView.lng.toFixed(6));
  params.set("z", mapView.zoom.toFixed(2));
  if (filters.limit !== null) {
    params.set("limit", String(filters.limit));
  }

  if (filters.selectedBoroughIds.length > 0) {
    params.set("boroughs", filters.selectedBoroughIds.join(","));
  }

  return params;
}
