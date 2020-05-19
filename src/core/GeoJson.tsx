import React, { useMemo } from 'react';
import * as G from 'geojson';
import { LatLng } from './models';
import { SvgLayer, Circle, Polygon, Polyline } from './vector';

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

function GeoJson(props: Props) {
  const { data } = props;
  const controlLatLng = useMemo(() => findContolPoint(collectPoints(data)), [data]);

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
    <SvgLayer center={controlLatLng}>
      {svgItems}
    </SvgLayer>
  );
}

export default GeoJson;
