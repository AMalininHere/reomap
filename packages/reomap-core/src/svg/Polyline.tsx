import React, { Ref } from 'react';
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

interface Props {
  positions: LatLng[];
}

type PathProps = Omit<React.SVGAttributes<SVGPathElement>, 'fill' | 'd'>;

function Polyline(props: Props & PathProps, ref: Ref<SVGPathElement>) {
  const {
    positions,
    ...pathProps
  } = props;
  const mapContext = useMapContext();

  const pathString = makeSvgPath(positions.map(mapContext.latLngToPixel));

  const pathPropsWitdhDefaults: PathProps = {
    stroke: '#555555',
    strokeWidth: 2,
    ...pathProps
  };

  return (
    <path ref={ref} fill="none" d={pathString} {...pathPropsWitdhDefaults} />
  );
}

export default React.memo(React.forwardRef(Polyline));
