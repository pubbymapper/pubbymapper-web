import { useEffect, useState } from "react";
import { BOROUGHS_GEOJSON_URL } from "../constants";
import type {
  BoroughFeature,
  BoroughFeatureCollection,
  BoroughOption,
} from "../types/borough";

interface UseBoroughsResult {
  boroughs: BoroughFeature[];
  options: BoroughOption[];
  loading: boolean;
  error: string | null;
}

function isValidBoroughFeature(candidate: unknown): candidate is BoroughFeature {
  if (!candidate || typeof candidate !== "object") return false;
  const feature = candidate as BoroughFeature;
  return (
    feature.type === "Feature"
    && (feature.geometry?.type === "Polygon" || feature.geometry?.type === "MultiPolygon")
    && typeof feature.properties?.NAME === "string"
    && typeof feature.properties?.GSS_CODE === "string"
  );
}

function toBoroughFeatures(payload: unknown): BoroughFeature[] {
  if (!payload || typeof payload !== "object") return [];
  const collection = payload as BoroughFeatureCollection;
  if (collection.type !== "FeatureCollection" || !Array.isArray(collection.features)) return [];
  return collection.features.filter(isValidBoroughFeature);
}

export function useBoroughs(): UseBoroughsResult {
  const [boroughs, setBoroughs] = useState<BoroughFeature[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    fetch(BOROUGHS_GEOJSON_URL, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Borough boundary request failed with ${response.status}`);
        }
        return response.json() as Promise<unknown>;
      })
      .then((payload) => {
        const features = toBoroughFeatures(payload);
        if (features.length === 0) {
          throw new Error("No borough features found in boundary response");
        }
        setBoroughs(features);
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setError(err instanceof Error ? err.message : "Unknown borough loading error");
        setLoading(false);
      });

    return () => controller.abort();
  }, []);

  const options = boroughs
    .map((borough) => ({
      id: borough.properties.GSS_CODE,
      name: borough.properties.NAME,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  return { boroughs, options, loading, error };
}
