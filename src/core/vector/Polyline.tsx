import React from 'react';
import { LatLng, Point } from '../models';

function makeSvgPath(points: Point[]) {
  return points
    .map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
    .join(' ');
}

export interface Props {
  positions: LatLng[];
  latLngToPixel: (ll: LatLng) => Point;
}

function Polyline(props: Props) {
  const { positions, latLngToPixel } = props;

  const pathString = makeSvgPath(positions.map(latLngToPixel));

  return (
    <path fill="none" stroke="#555555" strokeWidth={2} d={pathString} />
  );
}

export default React.memo(Polyline);