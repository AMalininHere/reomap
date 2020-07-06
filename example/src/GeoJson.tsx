import React, { useMemo } from 'react';
import * as G from 'geojson';
import { LatLng } from '@reomap/core';
import { SvgLayer, Circle, Polygon, Polyline } from '@reomap/core/vector';

function positionToLatLng([lng, lat]: G.Position) {
  return new LatLng(lat, lng);
}

function* lazyMap<T, R>(iterable: Iterable<T>, fn: (value: T, index: number) => R) {
  let counter = 0;
  for (const value of iterable) {
    yield fn(value, counter);
    ++counter;
  }
}

function* findFeatures(data: G.GeoJSON): Generator<G.Feature, void, unknown> {
  if (data.type === 'Feature') {
    yield data;
  } else if (data.type === 'FeatureCollection') {
    for (const feature of data.features) {
      yield feature;
    }
  }
}

function* collectPoints(data: G.GeoJSON) {
  for (const feature of findFeatures(data)) {
    const g = feature.geometry;
    if (g.type === 'LineString') {
      for (const c of g.coordinates) {
        yield positionToLatLng(c);
      }
    } else if (g.type === 'Point') {
      yield positionToLatLng(g.coordinates);
    } else if (g.type === 'Polygon') {
      for (const part of g.coordinates) {
        for (const c of part) {
          yield positionToLatLng(c);
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

  const svgItems = useMemo(() => [...lazyMap(findFeatures(data), (feature, idx) => {
    const g = feature.geometry;
    switch (g.type) {
      case 'Point': {
        const center = positionToLatLng(g.coordinates);
        return (
          <Circle key={`point-${feature.id ?? idx}`} center={center} radius={5} />
        );
      }

      case 'LineString': {
        const positions = g.coordinates.map(positionToLatLng);
        return (
          <Polyline key={`line-${feature.id ?? idx}`} positions={positions} />
        );
      }

      case 'Polygon': {
        const positions = g.coordinates.map(pp => pp.map(positionToLatLng));
        return (
          <Polygon key={`polygon-${feature.id ?? idx}`} positions={positions} />
        );
      }

      default: {
        return null;
      }
    }
  })], [data]);

  return (
    <SvgLayer center={controlLatLng}>
      {svgItems}
    </SvgLayer>
  );
}

export default GeoJson;
