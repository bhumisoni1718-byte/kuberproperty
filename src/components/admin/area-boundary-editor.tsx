"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import type { BoundaryCoordinate } from "@/lib/blog-utils";
import {
  buildStaticMapUrl,
  getGoogleMapsApiKey,
  getPolygonCentroid,
  loadGoogleMaps,
  VADODARA_CENTER,
} from "@/lib/google-maps";

type AreaBoundaryEditorProps = {
  value: BoundaryCoordinate[];
  onChange: (coords: BoundaryCoordinate[]) => void;
};

export function AreaBoundaryEditor({ value, onChange }: AreaBoundaryEditorProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<google.maps.Map | null>(null);
  const polygonRef = useRef<google.maps.Polygon | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const [mapReady, setMapReady] = useState(false);
  const [jsonText, setJsonText] = useState(() => JSON.stringify(value, null, 2));
  const hasApiKey = !!getGoogleMapsApiKey();

  const syncPolygon = useCallback(
    (coords: BoundaryCoordinate[]) => {
      if (!mapInstance.current || !window.google?.maps) return;

      polygonRef.current?.setMap(null);
      markersRef.current.forEach((m) => m.setMap(null));
      markersRef.current = [];

      if (coords.length >= 3) {
        polygonRef.current = new google.maps.Polygon({
          paths: coords,
          strokeColor: "#c8a84b",
          strokeOpacity: 1,
          strokeWeight: 2,
          fillColor: "#c8a84b",
          fillOpacity: 0.2,
          editable: false,
        });
        polygonRef.current.setMap(mapInstance.current);

        const bounds = new google.maps.LatLngBounds();
        coords.forEach((p) => bounds.extend(p));
        mapInstance.current.fitBounds(bounds);
      }

      coords.forEach((p) => {
        const marker = new google.maps.Marker({
          position: p,
          map: mapInstance.current!,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 6,
            fillColor: "#c8a84b",
            fillOpacity: 1,
            strokeColor: "#0a1628",
            strokeWeight: 1,
          },
        });
        markersRef.current.push(marker);
      });
    },
    []
  );

  useEffect(() => {
    if (!hasApiKey || !mapRef.current) return;

    let cancelled = false;

    loadGoogleMaps().then(() => {
      if (cancelled || !mapRef.current) return;

      const center = value.length > 0 ? getPolygonCentroid(value) : VADODARA_CENTER;
      mapInstance.current = new google.maps.Map(mapRef.current, {
        center,
        zoom: 13,
        mapTypeControl: true,
        streetViewControl: false,
      });

      mapInstance.current.addListener("click", (e: google.maps.MapMouseEvent) => {
        if (!e.latLng) return;
        const point = { lat: e.latLng.lat(), lng: e.latLng.lng() };
        onChange([...value, point]);
      });

      syncPolygon(value);
      setMapReady(true);
    });

    return () => {
      cancelled = true;
    };
  }, [hasApiKey]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (mapReady) syncPolygon(value);
    setJsonText(JSON.stringify(value, null, 2));
  }, [value, mapReady, syncPolygon]);

  function handleJsonApply() {
    try {
      const parsed = JSON.parse(jsonText) as BoundaryCoordinate[];
      if (!Array.isArray(parsed)) throw new Error("Must be an array");
      onChange(parsed);
    } catch {
      alert("Invalid JSON. Use format: [{\"lat\": 22.31, \"lng\": 73.18}, ...]");
    }
  }

  function handleUndo() {
    onChange(value.slice(0, -1));
  }

  function handleClear() {
    onChange([]);
  }

  const previewUrl = buildStaticMapUrl(value);

  return (
    <div className="space-y-3">
      <Label>Area boundary (click map to add points, or paste coordinates)</Label>

      {hasApiKey ? (
        <div className="space-y-2">
          <div ref={mapRef} className="h-72 w-full rounded-lg border border-navy/20" />
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" size="sm" onClick={handleUndo} disabled={value.length === 0}>
              Undo last point
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={handleClear} disabled={value.length === 0}>
              Clear all
            </Button>
            <span className="self-center text-xs text-navy/50">{value.length} point(s) — need 3+ for outline</span>
          </div>
        </div>
      ) : (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
          Set <code className="text-xs">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code> to draw boundaries on Google Maps.
          You can still paste coordinates below.
        </p>
      )}

      <div>
        <Label htmlFor="boundary-json">Coordinates JSON</Label>
        <textarea
          id="boundary-json"
          value={jsonText}
          onChange={(e) => setJsonText(e.target.value)}
          rows={5}
          className="mt-1 w-full rounded-md border px-3 py-2 font-mono text-xs"
          placeholder='[{"lat": 22.31, "lng": 73.18}, {"lat": 22.32, "lng": 73.19}]'
        />
        <Button type="button" variant="outline" size="sm" className="mt-2" onClick={handleJsonApply}>
          Apply coordinates
        </Button>
      </div>

      {previewUrl && value.length >= 3 && (
        <div>
          <p className="mb-1 text-xs text-navy/50">Preview</p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={previewUrl} alt="Boundary preview" className="h-40 w-full rounded-lg border object-cover" />
        </div>
      )}
    </div>
  );
}
