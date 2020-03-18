export class LatLng {
  constructor(
    public readonly lat: number,
    public readonly lng: number,
  ) { }
}

export class Point {
  constructor(
    public readonly x: number,
    public readonly y: number,
  ) { }

  substract(other: Point) {
    return new Point(
      this.x - other.x,
      this.y - other.y
    )
  }
}
