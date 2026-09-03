import type { BoundaryCoordinate } from "@/lib/blog-utils";

export const VADODARA_CENTER: BoundaryCoordinate = { lat: 22.3072, lng: 73.1812 };

export function getGoogleMapsApiKey(): string | undefined {
  return process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
}

export function getPolygonCentroid(points: BoundaryCoordinate[]): BoundaryCoordinate {
  if (points.length === 0) return VADODARA_CENTER;
  const sum = points.reduce(
    (acc, p) => ({ lat: acc.lat + p.lat, lng: acc.lng + p.lng }),
    { lat: 0, lng: 0 }
  );
  return { lat: sum.lat / points.length, lng: sum.lng / points.length };
}

/** Static Maps API polygon preview (same key as JS API). */
export function buildStaticMapUrl(
  points: BoundaryCoordinate[],
  options?: { width?: number; height?: number }
): string | null {
  const key = getGoogleMapsApiKey();
  if (!key || points.length < 2) return null;

  const path = points.map((p) => `${p.lat},${p.lng}`).join("|");
  const closedPath = `${path}|${points[0].lat},${points[0].lng}`;
  const center = getPolygonCentroid(points);
  const w = options?.width ?? 800;
  const h = options?.height ?? 400;

  const params = new URLSearchParams({
    size: `${w}x${h}`,
    center: `${center.lat},${center.lng}`,
    zoom: "13",
    path: `color:0xc8a84bff|weight:2|fillcolor:0xc8a84b33|${closedPath}`,
    key,
  });

  return `https://maps.googleapis.com/maps/api/staticmap?${params.toString()}`;
}

/** Simple embed (no API key) centered on a point — used as fallback. */
export function buildEmbedMapUrl(center: BoundaryCoordinate, zoom = 14): string {
  return `https://maps.google.com/maps?q=${center.lat},${center.lng}&z=${zoom}&output=embed`;
}

let loadPromise: Promise<void> | null = null;

/** Load Google Maps JavaScript API (interactive polygon maps). */
export function loadGoogleMaps(): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Google Maps can only load in the browser"));
  }

  const w = window as Window & { google?: { maps: unknown } };
  if (w.google?.maps) return Promise.resolve();

  const key = getGoogleMapsApiKey();
  if (!key) {
    return Promise.reject(new Error("NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is not set"));
  }

  if (loadPromise) return loadPromise;

  loadPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${key}`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Google Maps"));
    document.head.appendChild(script);
  });

  return loadPromise;
}
