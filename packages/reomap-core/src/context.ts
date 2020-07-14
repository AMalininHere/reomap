import React, { useContext } from 'react';
import { LatLng, Point, latLngToPixel, pixelToLatLng } from './common';

export class ContextState {
  constructor(
    public readonly center: LatLng,
    public readonly zoom: number,
    public readonly width: number,
    public readonly height: number,
  ) { }

  public readonly latLngToPixel = (source: LatLng) =>
    latLngToPixel(this.width, this.height, this.zoom, this.center, source);

  public readonly pixelToLatLng = (source: Point) =>
    pixelToLatLng(this.width, this.height, this.zoom, this.center, source);
}

const ctx = React.createContext<ContextState>(null!);

export const MapProvider = ctx.Provider;

export function useMapContext() {
  const data = useContext(ctx);

  return data;
}
