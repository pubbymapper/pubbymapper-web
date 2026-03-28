import { type FC, useMemo } from "react";
import { CircleMarker, Tooltip } from "react-leaflet";
import type { Pub } from "../types/pub";

interface PubMarkerProps {
  pub: Pub;
}

const MARKER_OPTIONS = {
  radius: 7,
  fillColor: "#0d9488",
  fillOpacity: 0.85,
  color: "#065f56",
  weight: 1.5,
} as const;

const PubMarker: FC<PubMarkerProps> = ({ pub }) => {
  const position = useMemo<[number, number]>(
    () => [pub.coords.lat, pub.coords.lng],
    [pub.coords.lat, pub.coords.lng],
  );

  return (
    <CircleMarker center={position} {...MARKER_OPTIONS}>
      <Tooltip direction="top" offset={[0, -8]} opacity={0.95}>
        <strong>{pub.name}</strong>
        <br />
        <span style={{ fontSize: 11, color: "#666" }}>{pub.pub_id}</span>
      </Tooltip>
    </CircleMarker>
  );
};

export default PubMarker;
