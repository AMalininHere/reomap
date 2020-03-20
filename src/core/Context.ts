import React, { useContext } from 'react';
import { LatLng } from './models';

interface MapContextType {
  width: number;
  height: number;
  center: LatLng;
  zoom: number;
}

const ctx = React.createContext<MapContextType>(null!);

export const MapProvider = ctx.Provider;

export function useMapContext() {
  const data = useContext(ctx);

  return data;
}
