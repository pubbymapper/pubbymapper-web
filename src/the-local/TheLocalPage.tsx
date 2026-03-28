import { type FC, useEffect, useMemo, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";

import { DEFAULT_CENTER, DEFAULT_ZOOM } from "./constants";
import NavBar from "./components/NavBar";
import PubMap from "./components/PubMap";
import { buildSearchParamsFromState, parseStateFromSearch } from "./utils/urlState";
import type { MapViewState, QueryFilters } from "./types/filters";
import { useBoroughs } from "./hooks/useBoroughs";
import "./the-local.css";

const defaultMapView: MapViewState = {
  lat: DEFAULT_CENTER[0],
  lng: DEFAULT_CENTER[1],
  zoom: DEFAULT_ZOOM,
};

const defaultFilters: QueryFilters = {
  limit: null,
  selectedBoroughIds: [],
};

function mapViewsEqual(a: MapViewState, b: MapViewState): boolean {
  return a.lat === b.lat && a.lng === b.lng && a.zoom === b.zoom;
}

function filtersEqual(a: QueryFilters, b: QueryFilters): boolean {
  if (a.limit !== b.limit) return false;
  if (a.selectedBoroughIds.length !== b.selectedBoroughIds.length) return false;
  const setA = new Set(a.selectedBoroughIds);
  return b.selectedBoroughIds.every((id) => setA.has(id));
}

const TheLocalPage: FC = () => {
  const location = useLocation();
  const [, setSearchParams] = useSearchParams();

  const [mapView, setMapView] = useState<MapViewState>(() => {
    const parsed = parseStateFromSearch(location.search);
    return parsed.mapView ?? defaultMapView;
  });
  const [filters, setFilters] = useState<QueryFilters>(() => {
    const parsed = parseStateFromSearch(location.search);
    return parsed.filters ?? defaultFilters;
  });

  const { boroughs, options, loading, error } = useBoroughs();

  const selectedBoroughs = useMemo(() => {
    if (boroughs.length === 0 || filters.selectedBoroughIds.length === 0) return [];
    const selectedIdSet = new Set(filters.selectedBoroughIds);
    return boroughs.filter((borough) => selectedIdSet.has(borough.properties.GSS_CODE));
  }, [boroughs, filters.selectedBoroughIds]);

  useEffect(() => {
    if (boroughs.length === 0) return;

    const validIds = new Set(boroughs.map((borough) => borough.properties.GSS_CODE));
    setFilters((current) => {
      const cleanedIds = current.selectedBoroughIds.filter((id) => validIds.has(id));
      if (cleanedIds.length === current.selectedBoroughIds.length) return current;
      return { ...current, selectedBoroughIds: cleanedIds };
    });
  }, [boroughs]);

  useEffect(() => {
    const parsed = parseStateFromSearch(location.search);
    setMapView((prev) => {
      const next = parsed.mapView ?? defaultMapView;
      if (mapViewsEqual(prev, next)) return prev;
      return next;
    });
    setFilters((prev) => {
      const next = parsed.filters ?? defaultFilters;
      if (filtersEqual(prev, next)) return prev;
      return next;
    });
  }, [location.search]);

  useEffect(() => {
    setSearchParams(buildSearchParamsFromState(mapView, filters), { replace: true });
  }, [mapView, filters, setSearchParams]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        background: "#fff9e5",
      }}
    >
      <NavBar
        limit={filters.limit}
        onLimitChange={(value) => {
          setFilters((current) => ({ ...current, limit: value }));
        }}
        boroughOptions={options}
        selectedBoroughIds={filters.selectedBoroughIds}
        onSelectedBoroughIdsChange={(ids) => {
          setFilters((current) => ({ ...current, selectedBoroughIds: ids }));
        }}
        boroughLoading={loading}
        boroughError={error}
      />
      <PubMap
        initialView={mapView}
        onViewChange={setMapView}
        limit={filters.limit ?? undefined}
        selectedBoroughs={selectedBoroughs}
      />
    </div>
  );
};

export default TheLocalPage;
