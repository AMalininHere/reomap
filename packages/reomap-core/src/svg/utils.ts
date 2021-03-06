import { Point } from '../common';

export function makeSvgPath(points: Point[]) {
  if (!points.length) {
    return '';
  }

  let p = points[0];
  let x = Math.round(p.x);
  let y = Math.round(p.y);

  const resultItems = [`M${x} ${y}`];

  for (let i = 1; i < points.length; i++) {
    p = points[i];

    const nextX = Math.round(p.x);
    const nextY = Math.round(p.y);

    if (nextX === x && nextY === y) {
      continue;
    }

    x = nextX;
    y = nextY;
    resultItems.push(`L${x} ${y}`);
  }

  return resultItems.join(' ');
}
