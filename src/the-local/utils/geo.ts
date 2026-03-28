import turfBbox from "@turf/bbox";
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import { featureCollection, point, polygon } from "@turf/helpers";
import intersect from "@turf/intersect";
import type { BBox as TurfBBox } from "geojson";
import type { BBox, Coords, Pub } from "../types/pub";
import type { BoroughFeature } from "../types/borough";

function toLeafletBBox([minLng, minLat, maxLng, maxLat]: TurfBBox): BBox {
  return {
    sw: { lat: minLat, lng: minLng },
    ne: { lat: maxLat, lng: maxLng },
  };
}

function bboxToViewportPolygon(viewport: BBox) {
  return polygon([
    [
      [viewport.sw.lng, viewport.sw.lat],
      [viewport.ne.lng, viewport.sw.lat],
      [viewport.ne.lng, viewport.ne.lat],
      [viewport.sw.lng, viewport.ne.lat],
      [viewport.sw.lng, viewport.sw.lat],
    ],
  ]);
}

function combineBounds(bounds: [BBox, ...BBox[]]): BBox {
  return bounds.reduce(
    (acc, current) => ({
      sw: {
        lat: Math.min(acc.sw.lat, current.sw.lat),
        lng: Math.min(acc.sw.lng, current.sw.lng),
      },
      ne: {
        lat: Math.max(acc.ne.lat, current.ne.lat),
        lng: Math.max(acc.ne.lng, current.ne.lng),
      },
    }),
    bounds[0],
  );
}

export function getConstrainedQueryBBox(viewport: BBox, boroughs: BoroughFeature[]): BBox | null {
  if (boroughs.length === 0) return viewport;

  const viewportPolygon = bboxToViewportPolygon(viewport);
  const overlaps: BBox[] = [];

  boroughs.forEach((borough) => {
    const overlappedArea = intersect(featureCollection([viewportPolygon, borough]));
    if (!overlappedArea) return;
    overlaps.push(toLeafletBBox(turfBbox(overlappedArea)));
  });

  if (overlaps.length === 0) return null;
  return combineBounds(overlaps as [BBox, ...BBox[]]);
}

function coordsToPoint(coords: Coords) {
  return point([coords.lng, coords.lat]);
}

export function isInsideAnySelectedBorough(coords: Coords, boroughs: BoroughFeature[]): boolean {
  if (boroughs.length === 0) return true;

  const candidate = coordsToPoint(coords);
  return boroughs.some((borough) => booleanPointInPolygon(candidate, borough));
}

export function filterPubsByBoroughs(pubs: Pub[], boroughs: BoroughFeature[]): Pub[] {
  if (boroughs.length === 0) return pubs;
  return pubs.filter((pub) => isInsideAnySelectedBorough(pub.coords, boroughs));
}
