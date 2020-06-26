import React, { Ref } from 'react';
import { useMapContext } from '../Context';
import { LatLng } from '../models';

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
    <circle ref={ref} {...circlePropsWidthDefaults} cx={point.x} cy={point.y} r={radius} />
  );
}

export default React.memo(React.forwardRef(Circle));
