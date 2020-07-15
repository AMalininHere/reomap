import React, { useContext } from 'react';
import { LatLng, Point, latLngToPixel, pixelToLatLng } from './common';

export class ContextState {
  public readonly center: LatLng;
  public readonly zoom: number;
  public readonly width: number;
  public readonly height: number;

  constructor(
    center: LatLng,
    zoom: number,
    width: number,
    height: number,
  ) {
    this.center = center;
    this.zoom = zoom;
    this.width = width;
    this.height = height;
  }

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
