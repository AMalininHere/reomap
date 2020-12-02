import React, { PropsWithChildren, SVGProps, useMemo } from 'react';
import { useMapContext, createContextState } from '../context';
import { SvgLayerProvider } from './context';
import Layer from '../Layer';
import { TILE_SIZE, LatLng } from '../common';
import { lng2tile, lat2tile } from '../utils/geo-fns';

type SvgProps = Omit<SVGProps<SVGSVGElement>, 'width' | 'height' | 'viewBox'>

interface Props {
  center?: LatLng;
}

function SvgLayer(props: PropsWithChildren<Props & SvgProps>) {
  const ctx = useMapContext();

  const {
    center = ctx.center,
    children,
    ...svgProps
  } = props;

  const relativeContextData = useMemo(
    () => createContextState(center, ctx.zoom, 0, 0),
    [center, ctx.zoom]
  );

  const offsetX = (lng2tile(center.lng, ctx.zoom) - lng2tile(ctx.center.lng, ctx.zoom)) * TILE_SIZE + ctx.width / 2;
  const offsetY = (lat2tile(center.lat, ctx.zoom) - lat2tile(ctx.center.lat, ctx.zoom)) * TILE_SIZE + ctx.height / 2;
  const viewBoxValues = `${-Math.round(offsetX)} ${-Math.round(offsetY)} ${ctx.width} ${ctx.height}`;

  return (
    <Layer>
      <svg
        {...svgProps}
        width={ctx.width}
        height={ctx.height}
        viewBox={viewBoxValues}
      >
        <SvgLayerProvider value={relativeContextData}>
          {children}
        </SvgLayerProvider>
      </svg>
    </Layer>
  );
}

export default SvgLayer;
