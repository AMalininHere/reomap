import React, { useRef } from 'react';
import Tiles from './Tiles';
import GeoJson from './GeoJson';
import { lng2tile, lat2tile, tile2lat, tile2lng } from './utils/geo-fns';
import { Point, LatLng } from './models';

import data from './test.json';

function getMousePoint(domElement: HTMLElement, event: React.MouseEvent) {
  const elementRect = domElement.getBoundingClientRect();
  return new Point(
    event.clientX - elementRect.left,
    event.clientY - elementRect.top
  );
}

export interface Props {
  width: number;
  height: number;
  zoom: number;
  center: LatLng;

  onChangeCenterZoom?: (center: LatLng, zoom: number) => any;
}



const absMinLatLng = new LatLng(
  tile2lat(Math.pow(2, 10), 10),
  tile2lng(0, 10)
);

const absMaxLatLng = new LatLng(
  tile2lat(0, 10),
  tile2lng(Math.pow(2, 10), 10)
);

function Map(props: Props) {
  const {
    width,
    height,
    zoom,
    center,
  } = props;

  const containerRef = useRef<HTMLDivElement>(null);
  const moveStartedRef = useRef(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    moveStartedRef.current = true;
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    e.preventDefault();
    moveStartedRef.current = false;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    e.preventDefault();
    if (moveStartedRef.current && props.onChangeCenterZoom) {
      const lat = tile2lat(lat2tile(center.lat, zoom) - (e.movementY / 256.0), zoom);
      const lng = tile2lng(lng2tile(center.lng, zoom) - (e.movementX / 256.0), zoom);
      const result = new LatLng(lat, lng);
      props.onChangeCenterZoom(result, zoom);
    }
  }

  const pixelToLatLng = (pixel: Point) => {

    const pointDiff = [
      (pixel.x - width / 2) / 256.0,
      (pixel.y - height / 2) / 256.0
    ];

    const tileX = lng2tile(center.lng, zoom) + pointDiff[0];
    const tileY = lat2tile(center.lat, zoom) + pointDiff[1];

    return new LatLng(
      Math.max(absMinLatLng.lat, Math.min(absMaxLatLng.lat, tile2lat(tileY, zoom))),
      Math.max(absMinLatLng.lng, Math.min(absMaxLatLng.lng, tile2lng(tileX, zoom)))
    );
  };

  const latLngToPixel = (latLng: LatLng) => {
    const tileCenterX = lng2tile(center.lng, zoom);
    const tileCenterY = lat2tile(center.lat, zoom);

    const tileX = lng2tile(latLng.lng, zoom);
    const tileY = lat2tile(latLng.lat, zoom);

    return new Point(
      (tileX - tileCenterX) * 256.0 + width / 2,
      (tileY - tileCenterY) * 256.0 + height / 2
    );
  }

  const handleWheel = (e: React.WheelEvent) => {
    if (!props.onChangeCenterZoom) {
      return;
    }

    const newCenter = pixelToLatLng(getMousePoint(containerRef.current!, e));
    if (e.deltaY > 0) {
      props.onChangeCenterZoom(center, zoom - 1);
    } else {
      props.onChangeCenterZoom(newCenter, zoom + 1);
    }
  };

  return (
    <div
      style={{ width, height, position: 'relative', margin: '0 auto', overflow: 'hidden' }}
      ref={containerRef}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseLeave={handleMouseUp}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
    >
      <Tiles center={center} zoom={zoom} height={height} width={width} />
      <GeoJson latLngToPixel={latLngToPixel} data={data as GeoJSON.GeoJSON} />
    </div>
  );
}

export default Map;
