import React from 'react';
import { LatLng } from './models';
import { lng2tile, lat2tile } from './utils/geo-fns';
import { useMapContext } from './Context';

const TILE_SIZE = 256;

function useTileValues(center: LatLng, width: number, height: number, zoom: number) {
  const tileCenterX = lng2tile(center.lng, zoom);
  const tileCenterY = lat2tile(center.lat, zoom);

  const halfWidth = width / 2 / 256.0;
  const halfHeight = height / 2 / 256.0;

  const tileMinX = Math.floor(tileCenterX - halfWidth);
  const tileMaxX = Math.floor(tileCenterX + halfWidth);

  const tileMinY = Math.floor(tileCenterY - halfHeight);
  const tileMaxY = Math.floor(tileCenterY + halfHeight);

  return {
    tileCenterX,
    tileCenterY,

    tileMinX,
    tileMaxX,

    tileMinY,
    tileMaxY,
  };
}

type TileProvider = (x: number, y: number, z: number) => string;

interface Props {
  provider: TileProvider;
}

function Tiles(props: Props) {
  const {
    center,
    zoom,
    width,
    height,
  } = useMapContext();

  const {
    tileCenterX,
    tileCenterY,

    tileMinX,
    tileMaxX,

    tileMinY,
    tileMaxY,
  } = useTileValues(center, width, height, zoom);

  const xMin = Math.max(tileMinX, 0);
  const yMin = Math.max(tileMinY, 0);
  const xMax = Math.min(tileMaxX, Math.pow(2, zoom) - 1);
  const yMax = Math.min(tileMaxY, Math.pow(2, zoom) - 1);

  const { provider } = props;
  const tiles: React.ReactNode[] = [];

  for (let x = xMin; x <= xMax; ++x) {
    for (let y = yMin; y <= yMax; ++y) {
      tiles.push(
        <img
          key={`${x}-${y}-${zoom}`}
          src={provider(x, y, zoom)}
          loading="lazy"
          style={{
            position: 'absolute',
            width: TILE_SIZE,
            height: TILE_SIZE,
            left: (x - tileMinX) * TILE_SIZE,
            top: (y - tileMinY) * TILE_SIZE
          }}
        />
      );
    }
  }

  const left = -((tileCenterX - tileMinX) * TILE_SIZE - width / 2);
  const top = -((tileCenterY - tileMinY) * TILE_SIZE - height / 2);

  const tilesStyle: React.CSSProperties = {
    position: 'absolute',
    width: (tileMaxX - tileMinX + 1) * TILE_SIZE,
    height: (tileMaxY - tileMinY + 1) * TILE_SIZE,
    willChange: 'transform',
    transform: `translate(${left}px, ${top}px)`,
  };

  return (
    <div style={tilesStyle}>
      {tiles}
    </div>
  );
}

export default Tiles;