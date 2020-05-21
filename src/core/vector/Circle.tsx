import React from 'react';
import { useMapContext } from '../Context';
import { LatLng } from '../models';

export interface Props {
  center: LatLng;
  radius: number;
}

type CirlceProps =
  & Pick<React.SVGAttributes<SVGCircleElement>, 'fill'>;

function Circle(props: Props & CirlceProps) {
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
    <circle {...circlePropsWidthDefaults} cx={point.x} cy={point.y} r={radius} />
  );
}

export default React.memo(Circle);
