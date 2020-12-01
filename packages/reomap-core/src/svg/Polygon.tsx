import React, { ComponentType, forwardRef, memo, RefAttributes } from 'react';
import { useMapContext } from '../context';
import { LatLng, Point } from '../common';

function makeSvgPath(points: Point[]) {
  return points
    .map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${Math.round(p.x)} ${Math.round(p.y)}`)
    .join(' ') + 'z';
}

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

  const mapContext = useMapContext();

  const pathString = positions
    .map(subPositions => subPositions.map(mapContext.latLngToPixel))
    .map(makeSvgPath)
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
