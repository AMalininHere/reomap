import React from 'react';
import { GeoJSON, LineString } from 'geojson';
import { Point, LatLng } from './models';
import { useMapContext } from './Context';
import Layer from './Layer';

function makeSvgPath(points: Point[]) {
  return points
    .map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
    .join(' ');
}

function findLines(data: GeoJSON) {
  const lines: LineString[] = [];

  if (data.type === 'LineString') {
    lines.push(data);
  } else if (data.type === 'Feature' && data.geometry.type === 'LineString') {
    lines.push(data.geometry);
  } else if (data.type === 'FeatureCollection') {
    for (const g of data.features) {
      lines.push(...findLines(g));
    }
  }

  return lines;
}

interface Props {
  data: GeoJSON;
}

function GeoJson(props: Props) {
  const { data } = props;

  const { latLngToPixel, width, height } = useMapContext();

  const linesStrings = findLines(data);

  const paths = linesStrings.map(ls => makeSvgPath(ls.coordinates
    .map(([lng, lat]) => new LatLng(lat, lng))
    .map(latLngToPixel)
  ));

  return (
    <Layer>
      <svg style={{ width, height }}>
        {paths.map((p, idx) => (
          <path key={idx} fill="none" stroke="#555555" strokeWidth={2} d={p} />
        ))}
      </svg>
    </Layer>
  );
}

export default GeoJson;
