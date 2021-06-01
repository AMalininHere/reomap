import { createContext, useContext } from 'react';
import { LatLng, Point, latLngToPixel, pixelToLatLng } from './common';

export interface ContextState {
  readonly center: LatLng;
  readonly zoom: number;
  readonly width: number;
  readonly height: number;
  readonly dragged?: boolean;

  latLngToPixel(source: LatLng): Point;
  pixelToLatLng(source: Point): LatLng;
}

export function createContextState(center: LatLng, zoom: number, width: number, height: number, dragged?: boolean): ContextState {
  return {
    center,
    zoom,
    width,
    height,
    dragged,
    latLngToPixel: (source: LatLng) => latLngToPixel(width, height, zoom, center, source),
    pixelToLatLng: (source: Point) => pixelToLatLng(width, height, zoom, center, source),
  };
}

const ctx = createContext<ContextState>(null!);
ctx.displayName = 'MapContext';

export const MapProvider = ctx.Provider;

export function useMapContext() {
  const data = useContext(ctx);

  return data;
}
