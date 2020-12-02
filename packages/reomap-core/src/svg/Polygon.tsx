import React, { ComponentType, forwardRef, memo, RefAttributes } from 'react';
import { LatLng } from '../common';
import { useSvgLayerContext } from './context';
import { makeSvgPath } from './utils';

type GeoProps = {
  positions: LatLng[][];
};

type PathProps = Omit<React.SVGProps<SVGPathElement>, 'fillRule' | 'd' | 'ref'>;

export type Props = PathProps & GeoProps & RefAttributes<SVGPathElement>;

const Polygon = memo(forwardRef<SVGPathElement, PathProps & GeoProps>(function Polygon(props, ref) {
  const {
    positions,
    ...pathProps
  } = props;

  const { latLngToPixel } = useSvgLayerContext();

  const pathString = positions
    .map(subPositions => subPositions.map(latLngToPixel))
    .map(points => `${makeSvgPath(points)} Z`)
    .join(' ');

  return (
    <path
      strokeWidth={2}
      stroke="#555555"
      fill="#555555"
      fillOpacity={0.5}
      {...pathProps}
      ref={ref}
      fillRule="evenodd" d={pathString}
    />
  );
})) as ComponentType<Props>;

export default Polygon;
