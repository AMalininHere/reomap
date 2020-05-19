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

function Polyline(props: Props) {
  const {
    positions,
  } = props;
  const mapContext = useMapContext();

  const pathString = makeSvgPath(positions.map(mapContext.latLngToPixel));

  return (
    <path fill="none" stroke="#555555" strokeWidth={2} d={pathString} />
  );
}

export default React.memo(Polyline);
