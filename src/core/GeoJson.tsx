import React from 'react';
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

function GeoJson(props: Props) {
  const { data } = props;

  const { latLngToPixel, width, height } = useMapContext();

  const { lines, points } = findElements(data);

  const paths = lines.map(ls => makeSvgPath(ls.coordinates
    .map(([lng, lat]) => new LatLng(lat, lng))
    .map(latLngToPixel)
  ));

  return (
    <Layer>
      <svg style={{ width, height }}>
        {paths.map((p, idx) => (
          <path key={idx} fill="none" stroke="#555555" strokeWidth={2} d={p} />
        ))}
        {points
          .map(p => new LatLng(p.coordinates[1], p.coordinates[0]))
          .map(latLngToPixel)
          .map(point => (
            <circle fill="#555555" cx={point.x} cy={point.y} r={5} />
          ))}
      </svg>
    </Layer>
  );
}

export default GeoJson;
