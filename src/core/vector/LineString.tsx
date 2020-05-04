import React from 'react';
import { LineString as GeoLineString } from 'geojson';
import { ElementProps } from './common';
import { LatLng } from '../models';
import Polyline from './Polyline';

function LineString(props: ElementProps<GeoLineString>) {
  const { geoElement: { coordinates }, latLngToPixel } = props;

  const positions = coordinates.map(([lng, lat]) => new LatLng(lat, lng));

  return (
    <Polyline latLngToPixel={latLngToPixel} positions={positions} />
  );
};

export default React.memo(LineString);