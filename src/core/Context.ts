import React, { useContext } from 'react';
import { LatLng } from './models';

export class ContextData {
  constructor(
    public readonly center: LatLng,
    public readonly zoom: number,
    public readonly width: number,
    public readonly height: number,
  ) { }
}

const ctx = React.createContext<ContextData>(null!);

export const MapProvider = ctx.Provider;

export function useMapContext() {
  const data = useContext(ctx);

  return data;
}
