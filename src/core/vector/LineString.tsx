import React from 'react';
import { LineString as GeoLineString } from 'geojson';
import { ElementProps } from './common';
import { LatLng, Point } from '../models';

function makeSvgPath(points: Point[]) {
  return points
    .map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
    .join(' ');
}

function LineString(props: ElementProps<GeoLineString>) {
  const { geoElement: { coordinates }, latLngToPixel } = props;
  const points = coordinates
    .map(([lng, lat]) => new LatLng(lat, lng))
    .map(latLngToPixel);

  const pathString = makeSvgPath(points);

  return (
    <path fill="none" stroke="#555555" strokeWidth={2} d={pathString} />
  );
};

export default React.memo(LineString);