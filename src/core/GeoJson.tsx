import React, { useMemo, useCallback } from 'react';
import * as G from 'geojson';
import { Point, LatLng } from './models';
import { useMapContext } from './Context';
import Layer from './Layer';
import { lat2tile, lng2tile } from './utils/geo-fns';
import { latLngToPixel } from './common';


function makeSvgPath(points: Point[]) {
  return points
    .map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
    .join(' ');
}

interface ElementProps<T extends G.GeoJsonObject> {
  geoElement: T;
  width: number;
  height: number;
  latLngToPixel: (ll: LatLng) => Point;
}

const SvgLine = React.memo<ElementProps<G.LineString>>(props => {
  const { geoElement: { coordinates }, latLngToPixel } = props;
  const points = coordinates
    .map(([lng, lat]) => new LatLng(lat, lng))
    .map(latLngToPixel);

  const pathString = makeSvgPath(points);

  return (
    <path fill="none" stroke="#555555" strokeWidth={2} d={pathString} />
  );
});

const SvgPoint = React.memo<ElementProps<G.Point>>(props => {
  const { geoElement: { coordinates }, latLngToPixel } = props;
  const point = latLngToPixel(new LatLng(coordinates[1], coordinates[0]));

  return (
    <circle fill="#555555" cx={point.x} cy={point.y} r={5} />
  );
})

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

function findContolPoint(points: G.Point[], lines: G.LineString[]) {
  let maxLat = Number.MIN_VALUE;
  let minLng = Number.MAX_VALUE;

  for (const p of points) {
    maxLat = Math.max(maxLat, p.coordinates[1]);
    minLng = Math.min(minLng, p.coordinates[0]);
  }

  for (const l of lines) {
    for (const c of l.coordinates) {
      maxLat = Math.max(maxLat, c[1]);
      minLng = Math.min(minLng, c[0]);
    }
  }

  return new LatLng(maxLat, minLng);
}

interface Props {
  data: G.GeoJSON;
}

function GeoJson(props: Props) {
  const { data } = props;
  const { width, height, center, zoom } = useMapContext();
  const { lines, points } = useMemo(() => findElements(data), [data]);
  const controlLatLng = useMemo(() => findContolPoint(points, lines), [ points, lines ]);
  const boundLatLngToPixel = useCallback(
    (latLng: LatLng) => latLngToPixel(0, 0, zoom, controlLatLng, latLng),
    [zoom, controlLatLng]
  );

  const offsetX = (lng2tile(controlLatLng.lng, zoom) - lng2tile(center.lng, zoom)) * 256 + width / 2;
  const offsetY = (lat2tile(controlLatLng.lat, zoom) - lat2tile(center.lat, zoom)) * 256 + height / 2;

  return (
    <Layer>
      <svg width={width} height={height}>
        <g transform={`translate(${offsetX}, ${offsetY})`}>
          {lines.map((l, idx) => (
            <SvgLine key={idx}
              geoElement={l}
              width={width}
              height={height}
              latLngToPixel={boundLatLngToPixel}
            />
          ))}
          {points.map((p, idx) => (
            <SvgPoint key={idx}
              geoElement={p}
              width={width}
              height={height}
              latLngToPixel={boundLatLngToPixel}
            />
          ))}
        </g>
      </svg>
    </Layer>
  );
}

export default GeoJson;
