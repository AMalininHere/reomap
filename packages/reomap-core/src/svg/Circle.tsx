import React, { ComponentType, forwardRef, memo, RefAttributes } from 'react';
import { LatLng } from '../common';
import { useSvgLayerContext } from './context';

type GeoProps = {
  center: LatLng;
  radius: number;
};

type CirlceProps = Omit<React.SVGProps<SVGCircleElement>, 'cx' | 'cy' | 'r' | 'ref'>;

export type Props = CirlceProps & GeoProps & RefAttributes<SVGCircleElement>;

const Circle = memo(forwardRef<SVGCircleElement, CirlceProps & GeoProps>(function Circle(props, ref) {
  const {
    center,
    radius,
    ...circleProps
  } = props;

  const { latLngToPixel } = useSvgLayerContext();

  const point = latLngToPixel(center);

  return (
    <circle
      fill="#555555"
      {...circleProps}
      ref={ref}
      cx={Math.round(point.x)} cy={Math.round(point.y)} r={radius}
    />
  );
})) as ComponentType<Props>;

export default Circle;
