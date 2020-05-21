import React from 'react';
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

type PathProps =
  & Pick<React.SVGAttributes<SVGPathElement>, 'stroke'>;

function Polyline(props: Props & PathProps) {
  const {
    positions,
    ...pathProps
  } = props;
  const mapContext = useMapContext();

  const pathString = makeSvgPath(positions.map(mapContext.latLngToPixel));

  const pathPropsWitdhDefaults: PathProps = {
    stroke: '#555555',
    ...pathProps
  };

  return (
    <path {...pathPropsWitdhDefaults} fill="none" strokeWidth={2} d={pathString} />
  );
}

export default React.memo(Polyline);
