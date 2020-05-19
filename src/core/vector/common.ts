import * as G from 'geojson';
import { LatLng, Point } from '../models';

export interface ElementProps<T extends G.Geometry> {
  geoElement: T;
  latLngToPixel: (ll: LatLng) => Point;
}
