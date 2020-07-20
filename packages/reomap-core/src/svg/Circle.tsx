import React, { Ref } from 'react';
import { useMapContext } from '../context';
import { LatLng } from '../common';

export interface Props {
  center: LatLng;
  radius: number;
}

type CirlceProps = Omit<React.SVGAttributes<SVGCircleElement>, 'cx' | 'cy' | 'r'>;

function Circle(props: Props & CirlceProps, ref: Ref<SVGCircleElement>) {
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
}

export default React.memo(React.forwardRef(Circle));
