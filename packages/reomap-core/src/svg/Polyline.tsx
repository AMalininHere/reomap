import { ComponentType, forwardRef, memo, Ref, RefAttributes } from 'react';
import { LatLng } from '../common';
import { useSvgLayerContext } from './context';
import { makeSvgPath } from './utils';

interface GeoProps {
  positions: LatLng[];
}

type PathProps = Omit<React.SVGProps<SVGPathElement>, 'fill' | 'd' | 'ref'>;

export type Props = PathProps & GeoProps & RefAttributes<SVGPathElement>;

function Polyline(props: PathProps & GeoProps, ref: Ref<SVGPathElement>) {
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
      fill="none"
      d={pathString}
    />
  );
}

export default memo(forwardRef(Polyline)) as ComponentType<Props>;
