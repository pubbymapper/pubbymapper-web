/**
 * Default `/api/1`: same-origin in the browser; the host proxies to the backend
 * (Vite in dev, Netlify in production — see vite.config.js and netlify.toml).
 * Set `VITE_API_BASE_URL` at build time only if you deploy without a proxy; the
 * API must then allow your site origin in CORS.
 */
const trimmed = import.meta.env.VITE_API_BASE_URL?.trim();
export const API_BASE_URL =
  trimmed && trimmed.length > 0 ? trimmed.replace(/\/$/, "") : "/api/1";

export const BOROUGHS_GEOJSON_URL =
  "https://raw.githubusercontent.com/KCL-ERG/useful_geography/master/london_boroughs.geojson";

export const DEFAULT_CENTER: [number, number] = [
  51.51472222567122,
  -0.10965918306367288,
];
export const DEFAULT_ZOOM = 16;
export const PUB_QUERY_LIMIT = 200;

/** Milliseconds to wait after the last map move before fetching pubs. */
export const DEBOUNCE_MS = 400;
