import React from 'react';
import { GeoJSON, LineString } from 'geojson';
import { Point, LatLng } from './models';
import { useMapContext } from './Context';

function makeSvgPath(points: Point[]) {
  return points
    .map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
    .join(' ');
}

interface Props {
  data: GeoJSON;
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

function GeoJson(props: Props) {
  const { data } = props;

  const { latLngToPixel } = useMapContext();

  const linesStrings = findLines(data);

  const paths = linesStrings.map(ls => makeSvgPath(ls.coordinates
    .map(([lng, lat]) => new LatLng(lat, lng))
    .map(latLngToPixel)
  ));

  return (
    <div style={{ position: 'absolute', width: '100%', height: '100%' }}>
      <svg style={{ width: '100%', height: '100%' }}>
        {paths.map((p, idx) => (
          <path key={idx} fill="none" stroke="#555555" strokeWidth={2} d={p}/>
        ))}
      </svg>
    </div>
  );
}

export default GeoJson;
