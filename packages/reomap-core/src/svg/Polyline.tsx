import React, { ComponentType, forwardRef, memo, RefAttributes } from 'react';
import { LatLng, Point } from '../common';
import { useSvgLayerContext } from './context';

function makeSvgPath(points: Point[]) {
  if (!points.length) {
    return '';
  }

  let p = points[0];
  let x = Math.round(p.x);
  let y = Math.round(p.y);

  const resultItems = [`M${x} ${y}`];

  for (let i = 1; i < points.length; i++) {
    p = points[i];

    const nextX = Math.round(p.x);
    const nextY = Math.round(p.y);

    if (nextX === x && nextY === y) {
      continue;
    }

    x = nextX;
    y = nextY;
    resultItems.push(`L${x} ${y}`);
  }

  return resultItems.join(' ');

}

interface GeoProps {
  positions: LatLng[];
}

type PathProps = Omit<React.SVGProps<SVGPathElement>, 'fill' | 'd' | 'ref'>;

export type Props = PathProps & GeoProps & RefAttributes<SVGPathElement>;

const Polyline = memo(forwardRef<SVGPathElement, PathProps & GeoProps>(function Polyline(props, ref) {
  const {
    positions,
    ...pathProps
  } = props;

  const { latLngToPixel } = useSvgLayerContext();

  const pathString = makeSvgPath(positions.map(latLngToPixel));

  return (
    <path
      stroke="#555555"
      strokeWidth={2}
      {...pathProps}
      ref={ref}
      fill="none" d={pathString}
    />
  );
})) as ComponentType<Props>;

export default Polyline;
