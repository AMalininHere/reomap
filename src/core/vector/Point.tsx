import React, { useMemo } from 'react';
import { Point as GeoPoint } from 'geojson';
import { ElementProps } from './common';
import { LatLng } from '../models';

function Point(props: ElementProps<GeoPoint>) {
  const { geoElement: { coordinates }, latLngToPixel } = props;
  const point = useMemo(() => latLngToPixel(new LatLng(coordinates[1], coordinates[0])), [coordinates, latLngToPixel]);

  return (
    <circle fill="#555555" cx={point.x} cy={point.y} r={5} />
  );
}

export default React.memo(Point);
