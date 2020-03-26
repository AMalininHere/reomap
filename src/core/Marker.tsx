import React from 'react';
import { LatLng } from './models';
import { useMapContext } from './Context';
import pointIcon from './point-icon.svg';

interface Props {
  pos: LatLng;
}

function Marker({ pos }: Props) {
  const { latLngToPixel } = useMapContext();
  const point = latLngToPixel(pos);

  return (
    <div style={{ display: 'inline-block', position: 'absolute', willChange: 'transform', transform: `translate(${point.x - 12}px, ${point.y - 30}px)` }}>
      <img style={{ width: 24, height: 30 }} src={pointIcon} />
    </div>
  );
}

export default Marker;