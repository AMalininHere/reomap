import React, { ComponentType, forwardRef, memo, RefAttributes } from 'react';
import { LatLng } from '../common';
import { useSvgLayerContext } from './context';
import { makeSvgPath } from './utils';

interface GeoProps {
  positions: LatLng[];
}

type PathProps = Omit<React.SVGProps<SVGPathElement>, 'fill' | 'd' | 'ref'>;

export type Props = PathProps & GeoProps & RefAttributes<SVGPathElement>;

const Polyline = memo(forwardRef<SVGPathElement, PathProps & GeoProps>(function Polyline(props, ref) {
  const {
    positions,
    ...pathProps
  } = props;

  const { latLngToPixel } = useSvgLayerContext();

  const pathString = makeSvgPath(positions.map(latLngToPixel));

  return (
    <path
      stroke="#555555"
      strokeWidth={2}
      {...pathProps}
      ref={ref}
      fill="none" d={pathString}
    />
  );
})) as ComponentType<Props>;

export default Polyline;
