import React from 'react';
import { useMapContext } from '../Context';
import { LatLng } from '../models';

export interface Props {
  center: LatLng;
  radius: number;
}

function Circle(props: Props) {
  const {
    center,
    radius,
  } = props;
  const mapContext = useMapContext();

  const point = mapContext.latLngToPixel(center);

  return (
    <circle fill="#555555" cx={point.x} cy={point.y} r={radius} />
  );
}

export default React.memo(Circle);
