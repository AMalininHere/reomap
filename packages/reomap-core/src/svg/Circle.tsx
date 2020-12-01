import React, { forwardRef, memo } from 'react';
import { useMapContext } from '../context';
import { LatLng } from '../common';

type GeoProps = {
  center: LatLng;
  radius: number;
};

type CirlceProps = Omit<React.SVGProps<SVGCircleElement>, 'cx' | 'cy' | 'r' | 'ref'>;

type Props = CirlceProps & GeoProps;

const Circle = memo(forwardRef<SVGCircleElement, Props>(function Circle(props, ref) {
  const {
    center,
    radius,
    ...circleProps
  } = props;
  const mapContext = useMapContext();

  const point = mapContext.latLngToPixel(center);

  const circlePropsWidthDefaults: CirlceProps = {
    fill: '#555555',
    ...circleProps
  }

  return (
    <circle ref={ref} cx={Math.round(point.x)} cy={Math.round(point.y)} r={radius} {...circlePropsWidthDefaults} />
  );
}));

export default Circle;
