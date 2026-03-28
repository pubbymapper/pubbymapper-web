import type { Feature, FeatureCollection, MultiPolygon, Polygon } from "geojson";

export interface BoroughProperties {
  NAME: string;
  GSS_CODE: string;
}

export type BoroughFeature = Feature<Polygon | MultiPolygon, BoroughProperties>;

export type BoroughFeatureCollection = FeatureCollection<
  Polygon | MultiPolygon,
  BoroughProperties
>;

export interface BoroughOption {
  id: string;
  name: string;
}
