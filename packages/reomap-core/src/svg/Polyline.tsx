import React, { forwardRef, memo } from 'react';
import { useMapContext } from '../context';
import { LatLng, Point } from '../common';

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

type Props = PathProps & GeoProps;

const Polyline = memo(forwardRef<SVGPathElement, Props>(function Polyline(props, ref) {
  const {
    positions,
    ...pathProps
  } = props;
  const mapContext = useMapContext();

  const pathString = makeSvgPath(positions.map(mapContext.latLngToPixel));

  return (
    <path
      stroke="#555555"
      strokeWidth={2}
      {...pathProps}
      ref={ref}
      fill="none" d={pathString}
    />
  );
}));

export default Polyline;
