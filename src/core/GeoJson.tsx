import React, { useMemo, useCallback } from 'react';
import * as G from 'geojson';
import Layer from './Layer';
import { lat2tile, lng2tile } from './utils/geo-fns';
import { latLngToPixel } from './common';
import { LatLng } from './models';
import { useMapContext, ContextData } from './Context';
import Circle from './vector/Circle';
import Polyline from './vector/Polyline';

function useLatLngToPixel(width: number, height: number, zoom: number, center: LatLng) {
  return useCallback(
    (latLng: LatLng) => latLngToPixel(width, height, zoom, center, latLng),
    [width, height, zoom, center]
  );
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

function findContolPoint(coords: Iterable<LatLng>) {
  let maxLat = Number.MIN_VALUE;
  let minLng = Number.MAX_VALUE;

  for (const ll of coords) {
    maxLat = Math.max(maxLat, ll.lat);
    minLng = Math.min(minLng, ll.lng);
  }

  return new LatLng(maxLat, minLng);
}

function* combineIterables<T>(...iterables: Iterable<T>[]) {
  for (const iterable of iterables) {
    yield* iterable;
  }
}

function* getCoordsFromPoints(points: G.Point[]) {
  for (const p of points) {
    yield new LatLng(p.coordinates[1], p.coordinates[0]);
  }
}

function* getCoordsFromLineStrings(lines: G.LineString[]) {
  for (const l of lines) {
    for (const c of l.coordinates) {
      yield new LatLng(c[1], c[0]);
    }
  }
}

interface Props {
  data: G.GeoJSON;
}

function useGeoOffsets(ctx: ContextData, controlLatLng: LatLng) {
  const offsetX = (lng2tile(controlLatLng.lng, ctx.zoom) - lng2tile(ctx.center.lng, ctx.zoom)) * 256 + ctx.width / 2;
  const offsetY = (lat2tile(controlLatLng.lat, ctx.zoom) - lat2tile(ctx.center.lat, ctx.zoom)) * 256 + ctx.height / 2;

  return { offsetX, offsetY };
}

function GeoJson(props: Props) {
  const { data } = props;
  const mapContext = useMapContext();
  const { lines, points } = useMemo(() => findElements(data), [data]);
  const controlLatLng = useMemo(() => findContolPoint(combineIterables(
    getCoordsFromPoints(points),
    getCoordsFromLineStrings(lines),
  )), [ points, lines ]);
  const boundLatLngToPixel = useLatLngToPixel(0, 0, mapContext.zoom, controlLatLng);

  const { offsetX, offsetY } = useGeoOffsets(mapContext, controlLatLng);

  const svgItems = useMemo(() => ([
    ...lines.map((l, idx) => {
      const positions = l.coordinates.map(([lng, lat]) => new LatLng(lat, lng));

      return (
        <Polyline key={`l-${idx}`}
          positions={positions}
          latLngToPixel={boundLatLngToPixel}
        />
      );
    }),
    ...points.map((p, idx) => {
      const center = new LatLng(p.coordinates[1], p.coordinates[0]);

      return (
        <Circle key={`p-${idx}`}
          center={center}
          radius={5}
          latLngToPixel={boundLatLngToPixel}
        />
      );
    })
  ]), [lines, points, boundLatLngToPixel])

  return (
    <Layer>
      <svg width={mapContext.width} height={mapContext.height}>
        <g transform={`translate(${offsetX}, ${offsetY})`}>
          {svgItems}
        </g>
      </svg>
    </Layer>
  );
}

export default GeoJson;
