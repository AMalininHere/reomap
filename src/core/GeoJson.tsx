import React, { useMemo } from 'react';
import * as G from 'geojson';
import { Point, LatLng } from './models';
import { useMapContext } from './Context';
import Layer from './Layer';

function makeSvgPath(points: Point[]) {
  return points
    .map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
    .join(' ');
}

interface Elements {
  lines: G.LineString[];
  points: G.Point[];
}

function findElements(data: G.GeoJSON) {
  const result: Elements = {
    lines: [],
    points: []
  };

  if (data.type === 'LineString') {
    result.lines.push(data);
  } else if (data.type === 'Point') {
    result.points.push(data);
  } else if (data.type === 'Feature' ) {
    const childResult = findElements(data.geometry);
    result.lines.push(...childResult.lines);
    result.points.push(...childResult.points);
  } else if (data.type === 'FeatureCollection') {
    for (const g of data.features) {
      const childResult = findElements(g);
      result.lines.push(...childResult.lines);
      result.points.push(...childResult.points);
    }
  }

  return result;
}

interface ElementProps<T extends G.GeoJsonObject> {
  geoElement: T;
  latLngToPixel: (ll: LatLng) => Point
}

function SvgLine(props: ElementProps<G.LineString>) {
  const { geoElement: { coordinates }, latLngToPixel } = props;
  const points = coordinates
    .map(([lng, lat]) => new LatLng(lat, lng))
    .map(latLngToPixel);

  const pathString = makeSvgPath(points);

  return (
    <path fill="none" stroke="#555555" strokeWidth={2} d={pathString} />
  );
}

function SvgPoint(props: ElementProps<G.Point>) {
  const { geoElement: { coordinates }, latLngToPixel } = props;
  const point = latLngToPixel(new LatLng(coordinates[1], coordinates[0]));

  return (
    <circle fill="#555555" cx={point.x} cy={point.y} r={5} />
  );
}

interface Props {
  data: G.GeoJSON;
}

function GeoJson(props: Props) {
  const { data } = props;
  const { latLngToPixel, width, height } = useMapContext();
  const { lines, points } = useMemo(() => findElements(data), [data]);

  return (
    <Layer>
      <svg style={{ width, height }}>
        {lines.map((l, idx) => (
          <SvgLine key={idx} geoElement={l} latLngToPixel={latLngToPixel} />
        ))}
        {points.map((p, idx) => (
          <SvgPoint key={idx} geoElement={p} latLngToPixel={latLngToPixel} />
        ))}
      </svg>
    </Layer>
  );
}

export default GeoJson;
