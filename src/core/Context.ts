import React, { useContext } from 'react';
import { LatLng, Point } from './models';

interface MapContextType {
  width: number;
  height: number;
  center: LatLng;
  zoom: number;
  latLngToPixel: (latLng: LatLng) => Point;
  pixelToLatLng: (pixel: Point) => LatLng;
}

const ctx = React.createContext<MapContextType>(null!);

export const MapProvider = ctx.Provider;

export function useMapContext() {
  const data = useContext(ctx);

  return data;
}
