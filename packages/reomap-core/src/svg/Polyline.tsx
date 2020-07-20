import React, { Ref } from 'react';
import { useMapContext } from '../context';
import { LatLng, Point } from '../common';

function makeSvgPath(points: Point[]) {
  return points
    .map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${Math.round(p.x)} ${Math.round(p.y)}`)
    .join(' ');
}

export interface Props {
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
