import { tile2lat, tile2lng, lng2tile, lat2tile } from './utils/geo-fns';

export interface LatLng {
  readonly lat: number;
  readonly lng: number;
}

export function latLng(lat: number, lng: number): LatLng {
  return {
    lat,
    lng
  };
}

export class Point {
  public readonly x: number;
  public readonly y: number;

  constructor(x: number, y: number,) {
    this.x = x;
    this.y = y;
  }
}

export const TILE_SIZE = 256;

export const absMinLatLng = latLng(
  tile2lat(Math.pow(2, 10), 10),
  tile2lng(0, 10)
);

export const absMaxLatLng = latLng(
  tile2lat(0, 10),
  tile2lng(Math.pow(2, 10), 10)
);

export function pixelToLatLng(width: number, height: number, zoom: number, center: LatLng, source: Point) {
  const pointDiffX = (source.x - width / 2) / TILE_SIZE;
  const pointDiffY = (source.y - height / 2) / TILE_SIZE;

  const tileX = lng2tile(center.lng, zoom) + pointDiffX;
  const tileY = lat2tile(center.lat, zoom) + pointDiffY;

  return latLng(
    Math.max(absMinLatLng.lat, Math.min(absMaxLatLng.lat, tile2lat(tileY, zoom))),
    Math.max(absMinLatLng.lng, Math.min(absMaxLatLng.lng, tile2lng(tileX, zoom)))
  );
}

export function latLngToPixel(width: number, height: number, zoom: number, center: LatLng, source: LatLng) {
  const tileCenterX = lng2tile(center.lng, zoom);
  const tileCenterY = lat2tile(center.lat, zoom);

  const tileX = lng2tile(source.lng, zoom);
  const tileY = lat2tile(source.lat, zoom);

  return new Point(
    (tileX - tileCenterX) * TILE_SIZE + width / 2,
    (tileY - tileCenterY) * TILE_SIZE + height / 2
  );
}
