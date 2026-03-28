import { type FC, useState } from "react";
import type { GeoJsonObject } from "geojson";
import { GeoJSON, MapContainer, TileLayer, useMapEvents } from "react-leaflet";
import type { Map as LeafletMap } from "leaflet";
import "leaflet/dist/leaflet.css";

import { usePubs } from "../hooks/usePubs";
import PubMarker from "./PubMarker";
import StatusOverlay from "./StatusOverlay";
import type { BoroughFeature } from "../types/borough";
import type { MapViewState } from "../types/filters";

interface MapViewSyncProps {
  onViewChange: (view: MapViewState) => void;
}

const MapViewSync: FC<MapViewSyncProps> = ({ onViewChange }) => {
  const map = useMapEvents({
    moveend: () => {
      const center = map.getCenter();
      onViewChange({
        lat: center.lat,
        lng: center.lng,
        zoom: map.getZoom(),
      });
    },
  });

  return null;
};

interface PubMapProps {
  initialView: MapViewState;
  onViewChange: (view: MapViewState) => void;
  limit?: number;
  selectedBoroughs: BoroughFeature[];
}

const boroughStyle = {
  color: "#0d9488",
  weight: 2,
  fillColor: "#14b8a6",
  fillOpacity: 0.12,
};

const PubMap: FC<PubMapProps> = ({
  initialView,
  onViewChange,
  limit,
  selectedBoroughs,
}) => {
  const [map, setMap] = useState<LeafletMap | null>(null);
  const { pubs, loading, error } = usePubs(map, {
    limit,
    selectedBoroughs,
  });

  return (
    <div style={{ position: "relative", flex: 1 }}>
      <MapContainer
        center={[initialView.lat, initialView.lng]}
        zoom={initialView.zoom}
        ref={setMap}
        style={{ height: "100%", width: "100%" }}
      >
        <MapViewSync onViewChange={onViewChange} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        {selectedBoroughs.map((borough) => (
          <GeoJSON
            key={borough.properties.GSS_CODE}
            data={borough as GeoJsonObject}
            style={boroughStyle}
          />
        ))}
        {pubs.map((pub) => (
          <PubMarker key={pub.pub_id} pub={pub} />
        ))}
      </MapContainer>

      <StatusOverlay loading={loading} error={error} count={pubs.length} />
    </div>
  );
};

export default PubMap;
