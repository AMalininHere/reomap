export class LatLng {
  constructor(
    public readonly lat: number,
    public readonly lng: number,
  ) { }

  equals(other: LatLng) {
    return (
      this.lat === other.lat &&
      this.lng === other.lng
    );
  }
}

export class Point {
  constructor(
    public readonly x: number,
    public readonly y: number,
  ) { }
}
