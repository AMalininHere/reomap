import React, { useMemo } from 'react';
import * as G from 'geojson';
import Layer from './Layer';
import { lat2tile, lng2tile } from './utils/geo-fns';
import { LatLng } from './models';
import { useMapContext, MapProvider, ContextData } from './Context';
import Circle from './vector/Circle';
import Polyline from './vector/Polyline';
import Polygon from './vector/Polygon';

function* lazyMap<T, R>(iterable: Iterable<T>, fn: (value: T, index: number) => R) {
  let counter = 0;
  for (const value of iterable) {
    yield fn(value, counter);
    ++counter;
  }
}

function* findGeometries(data: G.GeoJSON): Generator<G.Geometry, void, unknown> {
  if (data.type === 'LineString') {
    yield data;
  } else if (data.type === 'Point') {
    yield data;
  } else if (data.type === 'Polygon') {
    yield data;
  } else if (data.type === 'Feature') {
    yield* findGeometries(data.geometry);
  } else if (data.type === 'FeatureCollection') {
    for (const f of data.features) {
      yield* findGeometries(f);
    }
  }
}

function* collectPoints(data: G.GeoJSON) {
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
  const controlLatLng = useMemo(() => findContolPoint(collectPoints(data)), [data]);
  const relativeContextData = useMemo(
    () => new ContextData(controlLatLng, mapContext.zoom, 0, 0),
    [mapContext.zoom, controlLatLng]
  );

  const { offsetX, offsetY } = useGeoOffsets(mapContext, controlLatLng);

  const svgItems = useMemo(() => [...lazyMap(findGeometries(data), (g, idx) => {
    if (g.type === 'LineString') {
      const positions = g.coordinates.map(([lng, lat]) => new LatLng(lat, lng));

      return (
        <Polyline key={`line-${idx}`}
          positions={positions}
        />
      );
    } else if (g.type === 'Point') {
      const center = new LatLng(g.coordinates[1], g.coordinates[0]);

      return (
        <Circle key={`point-${idx}`}
          center={center}
          radius={5}
        />
      );
    } else if (g.type === 'Polygon') {
      const positions = g.coordinates.map(pp => pp.map(([lng, lat]) => new LatLng(lat, lng)));

      return (
        <Polygon key={`polygon-${idx}`}
          positions={positions}
        />
      );
    }

    return null;
  })], [data]);

  return (
    <Layer>
      <svg width={mapContext.width} height={mapContext.height}>
        <g transform={`translate(${offsetX}, ${offsetY})`}>
          <MapProvider value={relativeContextData}>
            {svgItems}
          </MapProvider>
        </g>
      </svg>
    </Layer>
  );
}

export default GeoJson;
