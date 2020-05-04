import React from 'react';
import { Point as GeoPoint } from 'geojson';
import { ElementProps } from './common';
import { LatLng } from '../models';
import Circle from './Circle';

function Point(props: ElementProps<GeoPoint>) {
  const { geoElement: { coordinates }, latLngToPixel } = props;
  const center = new LatLng(coordinates[1], coordinates[0]);

  return (
    <Circle latLngToPixel={latLngToPixel} center={center} radius={5}/>
  );
}

export default React.memo(Point);
