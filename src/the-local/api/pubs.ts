import type { BBox, PubsResponse } from "../types/pub";
import { API_BASE_URL } from "../constants";

/**
 * Fetch pubs within the given bounding box.
 *
 * The bbox query parameter is formatted as `sw_lat,sw_lng;ne_lat,ne_lng`.
 */
export async function fetchPubs(
  bbox: BBox,
  limit?: number,
  signal?: AbortSignal,
): Promise<PubsResponse> {
  const bboxParam = [
    `${bbox.sw.lat},${bbox.sw.lng}`,
    `${bbox.ne.lat},${bbox.ne.lng}`,
  ].join(";");

  const params = new URLSearchParams({ bbox: bboxParam });
  if (typeof limit === "number" && Number.isInteger(limit) && limit > 0) {
    params.set("limit", String(limit));
  }

  const response = await fetch(`${API_BASE_URL}/pubs?${params}`, { signal });

  if (!response.ok) {
    throw new Error(`Pubs API responded with ${response.status}`);
  }

  return response.json() as Promise<PubsResponse>;
}
