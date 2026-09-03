"use client";

import { useEffect, useRef, useState } from "react";
import type { BoundaryCoordinate } from "@/lib/blog-utils";
import {
  buildEmbedMapUrl,
  buildStaticMapUrl,
  getGoogleMapsApiKey,
  getPolygonCentroid,
  loadGoogleMaps,
  VADODARA_CENTER,
} from "@/lib/google-maps";

type GoogleAreaMapProps = {
  areaName: string;
  coordinates: BoundaryCoordinate[];
  className?: string;
};

export function GoogleAreaMap({ areaName, coordinates, className = "" }: GoogleAreaMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<"loading" | "interactive" | "static" | "embed">("loading");

  const center = coordinates.length > 0 ? getPolygonCentroid(coordinates) : VADODARA_CENTER;
  const staticUrl = buildStaticMapUrl(coordinates);
  const embedUrl = buildEmbedMapUrl(center);

  useEffect(() => {
    if (coordinates.length < 3) {
      setMode("embed");
      return;
    }

    const key = getGoogleMapsApiKey();
    if (!key || !mapRef.current) {
      setMode(staticUrl ? "static" : "embed");
      return;
    }

    let cancelled = false;
    let map: google.maps.Map | null = null;
    let polygon: google.maps.Polygon | null = null;

    loadGoogleMaps()
      .then(() => {
        if (cancelled || !mapRef.current) return;

        map = new google.maps.Map(mapRef.current, {
          center,
          zoom: 14,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
        });

        polygon = new google.maps.Polygon({
          paths: coordinates,
          strokeColor: "#c8a84b",
          strokeOpacity: 1,
          strokeWeight: 2,
          fillColor: "#c8a84b",
          fillOpacity: 0.25,
        });
        polygon.setMap(map);

        const bounds = new google.maps.LatLngBounds();
        coordinates.forEach((p) => bounds.extend(p));
        map.fitBounds(bounds);

        setMode("interactive");
      })
      .catch(() => {
        if (!cancelled) setMode(staticUrl ? "static" : "embed");
      });

    return () => {
      cancelled = true;
      polygon?.setMap(null);
      map = null;
    };
  }, [coordinates, center.lat, center.lng, staticUrl]);

  if (coordinates.length < 3) {
    return (
      <div className={`overflow-hidden rounded-xl border border-navy/10 ${className}`}>
        <iframe
          title={`Map of ${areaName}`}
          src={embedUrl}
          className="h-80 w-full"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    );
  }

  if (mode === "static" && staticUrl) {
    return (
      <div className={`overflow-hidden rounded-xl border border-navy/10 ${className}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={staticUrl} alt={`Map outline of ${areaName}`} className="h-80 w-full object-cover" />
      </div>
    );
  }

  if (mode === "embed") {
    return (
      <div className={`overflow-hidden rounded-xl border border-navy/10 ${className}`}>
        <iframe
          title={`Map of ${areaName}`}
          src={embedUrl}
          className="h-80 w-full"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    );
  }

  return (
    <div className={`overflow-hidden rounded-xl border border-navy/10 ${className}`}>
      {mode === "loading" && (
        <div className="flex h-80 items-center justify-center bg-cream text-sm text-navy/50">
          Loading map…
        </div>
      )}
      <div ref={mapRef} className={`h-80 w-full ${mode === "loading" ? "hidden" : ""}`} />
    </div>
  );
}
