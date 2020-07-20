import React, { Ref } from 'react';
import { useMapContext } from '../context';
import { LatLng, Point } from '../common';

function makeSvgPath(points: Point[]) {
  return points
    .map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${Math.round(p.x)} ${Math.round(p.y)}`)
    .join(' ') + 'z';
}

interface Props {
  positions: LatLng[][];
}

type PathProps = Omit<React.SVGAttributes<SVGPathElement>, 'fillRule' | 'd'>;

function Polygon(props: Props & PathProps, ref: Ref<SVGPathElement>) {
  const {
    positions,
    ...pathProps
  } = props;

  const mapContext = useMapContext();

  const pathString = positions
    .map(subPositions => subPositions.map(mapContext.latLngToPixel))
    .map(makeSvgPath)
    .join(' ');

  const pathPropsWitdhDefaults: PathProps = {
    strokeWidth: 2,
    stroke: '#555555',
    fill: '#555555',
    fillOpacity: 0.5,
    ...pathProps
  };

  return (
    <path ref={ref} fillRule="evenodd" d={pathString} {...pathPropsWitdhDefaults} />
  );
}

export default React.memo(React.forwardRef(Polygon));
