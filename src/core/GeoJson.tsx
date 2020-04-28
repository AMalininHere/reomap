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

interface Props {
  data: G.GeoJSON;
}

function SvgLine(props: { line: G.LineString, latLngToPixel: (ll: LatLng) => Point }) {
  const { line: { coordinates }, latLngToPixel } = props;
  const points = coordinates
    .map(([lng, lat]) => new LatLng(lat, lng))
    .map(latLngToPixel);

  const pathString = makeSvgPath(points);

  return (
    <path fill="none" stroke="#555555" strokeWidth={2} d={pathString} />
  );
}

function SvgPoint(props: { point: G.Point, latLngToPixel: (ll: LatLng) => Point }) {
  const { point: { coordinates }, latLngToPixel } = props;
  const point = latLngToPixel(new LatLng(coordinates[1], coordinates[0]));

  return (
    <circle fill="#555555" cx={point.x} cy={point.y} r={5} />
  );
}

function GeoJson(props: Props) {
  const { data } = props;
  const { latLngToPixel, width, height } = useMapContext();
  const { lines, points } = useMemo(() => findElements(data), [data]);

  return (
    <Layer>
      <svg style={{ width, height }}>
        {lines.map((l, idx) => (
          <SvgLine key={idx} line={l} latLngToPixel={latLngToPixel} />
        ))}
        {points.map((p, idx) => (
          <SvgPoint key={idx} point={p} latLngToPixel={latLngToPixel} />
        ))}
      </svg>
    </Layer>
  );
}

export default GeoJson;
