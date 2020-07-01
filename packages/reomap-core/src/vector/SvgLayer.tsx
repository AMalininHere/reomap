import React, { useMemo } from 'react';
import { useMapContext, MapProvider, ContextData } from '../Context';
import Layer from '../Layer';
import { LatLng } from '../models';
import { TILE_SIZE } from '../common';
import { lng2tile, lat2tile } from '../utils/geo-fns';

interface Props {
  center?: LatLng;
  children: React.ReactNode | React.ReactNode[];
}

function SvgLayer(props: Props) {
  const ctx = useMapContext();
  const {
    center = ctx.center,
    children,
  } = props;
  const relativeContextData = useMemo(
    () => new ContextData(center, ctx.zoom, 0, 0),
    [center, ctx.zoom]
  );

  const offsetX = (lng2tile(center.lng, ctx.zoom) - lng2tile(ctx.center.lng, ctx.zoom)) * TILE_SIZE + ctx.width / 2;
  const offsetY = (lat2tile(center.lat, ctx.zoom) - lat2tile(ctx.center.lat, ctx.zoom)) * TILE_SIZE + ctx.height / 2;
  const viewBoxValues = `${-offsetX} ${-offsetY} ${ctx.width} ${ctx.height}`;

  return (
    <Layer>
      <svg width={ctx.width} height={ctx.height} viewBox={viewBoxValues}>
        <MapProvider value={relativeContextData}>
          {children}
        </MapProvider>
      </svg>
    </Layer>
  );
}

export default SvgLayer;
