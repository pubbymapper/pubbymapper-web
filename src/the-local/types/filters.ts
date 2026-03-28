export interface MapViewState {
  lat: number;
  lng: number;
  zoom: number;
}

export interface QueryFilters {
  /** Pub query limit; null means no limit. */
  limit: number | null;
  selectedBoroughIds: string[];
}
