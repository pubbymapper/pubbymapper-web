import { useCallback, useEffect, useRef, useState } from "react";
import type { Map as LeafletMap } from "leaflet";
import type { BBox, Pub } from "../types/pub";
import { fetchPubs } from "../api/pubs";
import { DEBOUNCE_MS } from "../constants";
import type { BoroughFeature } from "../types/borough";
import { filterPubsByBoroughs, getConstrainedQueryBBox } from "../utils/geo";

interface UsePubsResult {
  pubs: Pub[];
  loading: boolean;
  error: string | null;
}

interface UsePubsOptions {
  limit?: number;
  selectedBoroughs: BoroughFeature[];
}

function bboxFromMap(map: LeafletMap): BBox {
  const bounds = map.getBounds();
  return {
    sw: { lat: bounds.getSouthWest().lat, lng: bounds.getSouthWest().lng },
    ne: { lat: bounds.getNorthEast().lat, lng: bounds.getNorthEast().lng },
  };
}

/**
 * Fetches pubs for the current map viewport, re-querying whenever the
 * bounding box changes (debounced).
 */
export function usePubs(
  map: LeafletMap | null,
  { limit, selectedBoroughs }: UsePubsOptions,
): UsePubsResult {
  const [pubs, setPubs] = useState<Pub[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadPubs = useCallback(
    (currentMap: LeafletMap) => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setLoading(true);
      setError(null);

      const viewportBBox = bboxFromMap(currentMap);
      const shouldConstrainToBoroughs = selectedBoroughs.length > 0;
      const queryBBox = shouldConstrainToBoroughs
        ? getConstrainedQueryBBox(viewportBBox, selectedBoroughs)
        : viewportBBox;

      if (!queryBBox) {
        setPubs([]);
        setLoading(false);
        return;
      }

      fetchPubs(queryBBox, limit, controller.signal)
        .then((data) => {
          const nextPubs = shouldConstrainToBoroughs
            ? filterPubsByBoroughs(data.pubs, selectedBoroughs)
            : data.pubs;
          setPubs(nextPubs);
          setLoading(false);
        })
        .catch((err: unknown) => {
          if (err instanceof DOMException && err.name === "AbortError") return;
          setError(err instanceof Error ? err.message : "Unknown error");
          setLoading(false);
        });
    },
    [limit, selectedBoroughs],
  );

  const scheduleFetch = useCallback(
    (currentMap: LeafletMap) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => loadPubs(currentMap), DEBOUNCE_MS);
    },
    [loadPubs],
  );

  useEffect(() => {
    if (!map) return;

    loadPubs(map);

    const onMoveEnd = () => scheduleFetch(map);
    map.on("moveend", onMoveEnd);

    return () => {
      map.off("moveend", onMoveEnd);
      abortRef.current?.abort();
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [map, loadPubs, scheduleFetch]);

  return { pubs, loading, error };
}
