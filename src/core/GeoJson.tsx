import React, { useMemo, useCallback } from 'react';
import * as G from 'geojson';
import Layer from './Layer';
import { lat2tile, lng2tile } from './utils/geo-fns';
import { latLngToPixel } from './common';
import { LatLng } from './models';
import { useMapContext, ContextData } from './Context';
import Circle from './vector/Circle';
import Polyline from './vector/Polyline';
import Polygon from './vector/Polygon';

function useLatLngToPixel(width: number, height: number, zoom: number, center: LatLng) {
  return useCallback(
    (latLng: LatLng) => latLngToPixel(width, height, zoom, center, latLng),
    [width, height, zoom, center]
  );
}

interface Elements {
  lines: G.LineString[];
  points: G.Point[];
  polygons: G.Polygon[];
}

function* findGeometries(data: G.GeoJSON): Generator<G.Geometry, void, undefined> {
  if (data.type === 'LineString') {
    yield data;
  } else if (data.type === 'Point') {
    yield data;
  } else if (data.type === 'Polygon') {
    yield data;
  } else if (data.type === 'Feature' ) {
    yield* findGeometries(data.geometry);
  } else if (data.type === 'FeatureCollection') {
    for (const f of data.features) {
      yield* findGeometries(f);
    }
  }
}

function* collectPoints(data: G.GeoJSON): Generator<LatLng, void, undefined> {
  for (const g of findGeometries(data)) {
    if (g.type === 'LineString') {
      for (const c of g.coordinates) {
        yield new LatLng(c[1], c[0]);
      }
    } else if (g.type === 'Point') {
      yield new LatLng(g.coordinates[1], g.coordinates[0]);
    } else if (g.type === 'Polygon') {
      for (const part of g.coordinates) {
        for (const c of part) {
          yield new LatLng(c[1], c[0]);
        }
      }
    }
  }
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
  const controlLatLng = useMemo(() => findContolPoint(collectPoints(data)), [ data ]);
  const boundLatLngToPixel = useLatLngToPixel(0, 0, mapContext.zoom, controlLatLng);

  const { offsetX, offsetY } = useGeoOffsets(mapContext, controlLatLng);

  const svgItems = useMemo(() => [...findGeometries(data)].map((g, idx) => {
    if (g.type === 'LineString') {
      const positions = g.coordinates.map(([lng, lat]) => new LatLng(lat, lng));

      return (
        <Polyline key={`l-${idx}`}
          positions={positions}
          latLngToPixel={boundLatLngToPixel}
        />
      );
    } else if (g.type === 'Point') {
      const center = new LatLng(g.coordinates[1], g.coordinates[0]);

      return (
        <Circle key={`p-${idx}`}
          center={center}
          radius={5}
          latLngToPixel={boundLatLngToPixel}
        />
      );
    } else if (g.type === 'Polygon') {
      const positions = g.coordinates.map(pp => pp.map(([lng, lat]) => new LatLng(lat, lng)));

      return (
        <Polygon key={`pp-${idx}`}
          positions={positions}
          latLngToPixel={boundLatLngToPixel}
        />
      );
    }

    return null;
  }), [data, boundLatLngToPixel]);

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
