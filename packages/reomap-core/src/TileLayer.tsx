import { lng2tile, lat2tile } from './utils/geo-fns';
import { useMapContext } from './context';
import { TILE_SIZE } from './common';
import Tile from './Tile';

function useTileValues() {
  const {
    center,
    zoom,
    width,
    height,
  } = useMapContext();


  const roundedZoom = Math.round(zoom);
  const zoomDiff = zoom - roundedZoom;

  const scale = Math.pow(2, zoomDiff);
  const scaleWidth = width / scale;
  const scaleHeight = height / scale;

  const tileCenterX = lng2tile(center.lng, roundedZoom);
  const tileCenterY = lat2tile(center.lat, roundedZoom);

  const halfWidth = scaleWidth / 2 / TILE_SIZE;
  const halfHeight = scaleHeight / 2 / TILE_SIZE;

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

    roundedZoom,

    scale,
    scaleWidth,
    scaleHeight,
  };
}

type TileProvider = (x: number, y: number, z: number) => string;

interface Props {
  provider: TileProvider;
  tileClassName?: string;
  className?: string;
}

function TileLayer(props: Props) {
  const {
    tileCenterX,
    tileCenterY,

    tileMinX,
    tileMaxX,

    tileMinY,
    tileMaxY,

    roundedZoom,

    scale,
    scaleWidth,
    scaleHeight,
  } = useTileValues();

  const xMin = Math.max(tileMinX, 0);
  const yMin = Math.max(tileMinY, 0);
  const xMax = Math.min(tileMaxX, Math.pow(2, roundedZoom) - 1);
  const yMax = Math.min(tileMaxY, Math.pow(2, roundedZoom) - 1);

  const { provider, tileClassName, className } = props;
  const tiles: React.ReactNode[] = [];

  for (let x = xMin; x <= xMax; ++x) {
    for (let y = yMin; y <= yMax; ++y) {
      tiles.push(
        <Tile
          key={`${x}-${y}-${roundedZoom}`}
          alt=""
          src={provider(x, y, roundedZoom)}
          loading="lazy"
          className={tileClassName}
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

  const left = -((tileCenterX - tileMinX) * TILE_SIZE - scaleWidth / 2);
  const top = -((tileCenterY - tileMinY) * TILE_SIZE - scaleHeight / 2);

  const tilesStyle: React.CSSProperties = {
    position: 'absolute',
    width: (tileMaxX - tileMinX + 1) * TILE_SIZE,
    height: (tileMaxY - tileMinY + 1) * TILE_SIZE,
    willChange: 'transform',
    transform: `translate(${left * scale}px, ${top * scale}px) scale(${scale})`,
    transformOrigin: 'top left',
  };

  return (
    <div className={className} style={tilesStyle}>
      {tiles}
    </div>
  );
}

export default TileLayer;
