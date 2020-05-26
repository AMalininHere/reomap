import React, { Ref } from 'react';
import { useMapContext } from '../Context';
import { LatLng, Point } from '../models';

function makeSvgPath(points: Point[]) {
  return points
    .map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
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
    <path ref={ref} {...pathPropsWitdhDefaults} fill="none" d={pathString} />
  );
}

export default React.memo(React.forwardRef(Polyline));
