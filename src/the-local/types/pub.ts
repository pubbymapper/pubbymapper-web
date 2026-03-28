export interface Coords {
  lat: number;
  lng: number;
}

export interface Pub {
  pub_id: string;
  name: string;
  coords: Coords;
}

export interface BBox {
  sw: Coords;
  ne: Coords;
}

export interface PubsResponse {
  query: {
    bbox: BBox;
    limit: number;
  };
  pubs: Pub[];
}
