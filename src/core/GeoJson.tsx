import React, { useMemo, useCallback } from 'react';
import * as G from 'geojson';
import Layer from './Layer';
import Point from './vector/Point';
import LineString from './vector/LineString';
import { lat2tile, lng2tile } from './utils/geo-fns';
import { latLngToPixel } from './common';
import { LatLng } from './models';
import { useMapContext, ContextData } from './Context';

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

function useGeoOffsets(ctx: ContextData, controlLatLng: LatLng) {
  const offsetX = (lng2tile(controlLatLng.lng, ctx.zoom) - lng2tile(ctx.center.lng, ctx.zoom)) * 256 + ctx.width / 2;
  const offsetY = (lat2tile(controlLatLng.lat, ctx.zoom) - lat2tile(ctx.center.lat, ctx.zoom)) * 256 + ctx.height / 2;

  return { offsetX, offsetY };
}

function GeoJson(props: Props) {
  const { data } = props;
  const mapContext = useMapContext();
  const { lines, points } = useMemo(() => findElements(data), [data]);
  const controlLatLng = useMemo(() => findContolPoint(points, lines), [ points, lines ]);
  const boundLatLngToPixel = useLatLngToPixel(0, 0, mapContext.zoom, controlLatLng);

  const { offsetX, offsetY } = useGeoOffsets(mapContext, controlLatLng);

  const svgItems = useMemo(() => ([
    ...lines.map((l, idx) => (
      <LineString key={`l-${idx}`}
        geoElement={l}
        latLngToPixel={boundLatLngToPixel}
      />
    )),
    ...points.map((p, idx) => (
      <Point key={`p-${idx}`}
        geoElement={p}
        latLngToPixel={boundLatLngToPixel}
      />
    ))
  ]), [lines, points, boundLatLngToPixel])

  return (
    <Layer>
      {(mapContext.width > 0 && mapContext.height > 0) && (
        <svg width={mapContext.width} height={mapContext.height}>
          <g transform={`translate(${offsetX}, ${offsetY})`}>
            {svgItems}
          </g>
        </svg>
      )}
    </Layer>
  );
}

export default GeoJson;
