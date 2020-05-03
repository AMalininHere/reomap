import { tile2lat, tile2lng, lng2tile, lat2tile } from './utils/geo-fns';
import { LatLng, Point } from './models';

export const absMinLatLng = new LatLng(
  tile2lat(Math.pow(2, 10), 10),
  tile2lng(0, 10)
);

export const absMaxLatLng = new LatLng(
  tile2lat(0, 10),
  tile2lng(Math.pow(2, 10), 10)
);

export function pixelToLatLng(width: number, height: number, zoom: number, center: LatLng, source: Point) {
  const pointDiffX = (source.x - width / 2) / 256.0;
  const pointDiffY = (source.y - height / 2) / 256.0;

  const tileX = lng2tile(center.lng, zoom) + pointDiffX;
  const tileY = lat2tile(center.lat, zoom) + pointDiffY;

  return new LatLng(
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
    (tileX - tileCenterX) * 256.0 + width / 2,
    (tileY - tileCenterY) * 256.0 + height / 2
  );
};
