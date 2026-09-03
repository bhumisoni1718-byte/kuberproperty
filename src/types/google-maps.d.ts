declare namespace google.maps {
  class Map {
    constructor(el: HTMLElement, opts?: MapOptions);
    fitBounds(bounds: LatLngBounds): void;
    addListener(event: string, handler: (e: MapMouseEvent) => void): MapsEventListener;
  }
  class LatLngBounds {
    extend(point: LatLngLiteral): void;
  }
  class Polygon {
    constructor(opts?: PolygonOptions);
    setMap(map: Map | null): void;
  }
  class Marker {
    constructor(opts?: MarkerOptions);
    setMap(map: Map | null): void;
  }
  interface MapOptions {
    center?: LatLngLiteral;
    zoom?: number;
    mapTypeControl?: boolean;
    streetViewControl?: boolean;
    fullscreenControl?: boolean;
  }
  interface MapMouseEvent {
    latLng?: { lat(): number; lng(): number };
  }
  interface LatLngLiteral {
    lat: number;
    lng: number;
  }
  interface PolygonOptions {
    paths?: LatLngLiteral[];
    strokeColor?: string;
    strokeOpacity?: number;
    strokeWeight?: number;
    fillColor?: string;
    fillOpacity?: number;
    editable?: boolean;
  }
  interface MarkerOptions {
    position?: LatLngLiteral;
    map?: Map;
    icon?: symbol | SymbolPath;
  }
  enum SymbolPath {
    CIRCLE = 0,
  }
  interface MapsEventListener {}
}

declare namespace google {
  const maps: typeof google.maps;
}

interface Window {
  google?: typeof google;
}
