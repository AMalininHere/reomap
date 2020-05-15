import React from 'react';
import { LatLng, Point } from '../models';

export interface Props {
  center: LatLng;
  radius: number;
  latLngToPixel: (ll: LatLng) => Point;
}

function Circle(props: Props) {
  const {
    center,
    radius,
    latLngToPixel,
  } = props;
  const point = latLngToPixel(center);

  return (
    <circle fill="#555555" cx={point.x} cy={point.y} r={radius} />
  );
}

export default React.memo(Circle);