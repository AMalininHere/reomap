import React, { Ref } from 'react';
import { useMapContext } from '../Context';
import { LatLng, Point } from '../models';

function makeSvgPath(points: Point[]) {
  return points
    .map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
    .join(' ') + 'z';
}

interface Props {
  positions: LatLng[][];
}

function Polygon(props: Props, ref: Ref<SVGPathElement>) {
  const {
    positions,
  } = props;

  const mapContext = useMapContext();

  const pathString = positions
    .map(subPositions => subPositions.map(mapContext.latLngToPixel))
    .map(makeSvgPath)
    .join(' ');


  return (
    <path ref={ref} fillRule="evenodd" fillOpacity="0.5" stroke="#555555" fill="#555555" strokeWidth={2} d={pathString} />
  );
}

export default React.memo(React.forwardRef(Polygon));
