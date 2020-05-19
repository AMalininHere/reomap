import React from 'react';
import { LatLng, Point } from '../models';

function makeSvgPath(points: Point[]) {
  return points
    .map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
    .join(' ') + 'z';
}

interface Props {
  positions: LatLng[][];
  latLngToPixel: (ll: LatLng) => Point;
}

function Polygon(props: Props) {
  const {
    positions,
    latLngToPixel,
  } = props;

  const pathString = positions
    .map(subPositions => subPositions.map(latLngToPixel))
    .map(makeSvgPath)
    .join(' ');


  return (
    <path fillRule="evenodd" fillOpacity="0.5" stroke="#555555" fill="#555555" strokeWidth={2} d={pathString} />
  );
}

export default React.memo(Polygon);
