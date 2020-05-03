import React, { useRef, useCallback } from 'react';
import { lng2tile, lat2tile, tile2lat, tile2lng } from './utils/geo-fns';
import { pixelToLatLng } from './common';
import { Point, LatLng } from './models';
import { MapProvider, ContextData } from './Context';
import { useThrottleCallback } from './utils/hooks';

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
  style?: React.CSSProperties;

  zoom: number;
  center: LatLng;
  onChangeCenterZoom?: (center: LatLng, zoom: number) => any;
  children: React.ReactNode | React.ReactNode[]
}

function noop() {}

function Map(props: Props) {
  const {
    width,
    height,
    style,
    zoom,
    center,
    onChangeCenterZoom = noop,
  } = props;

  const containerRef = useRef<HTMLDivElement>(null);
  const moveStartedRef = useRef(false);
  const throttledOnChangeCenterZoom = useThrottleCallback(onChangeCenterZoom, 150);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) {
      return;
    }

    e.preventDefault();
    moveStartedRef.current = true;
  }, []);

  const handleMouseUp = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    moveStartedRef.current = false;
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    e.preventDefault();
    if (moveStartedRef.current && props.onChangeCenterZoom) {
      const lat = tile2lat(lat2tile(center.lat, zoom) - (e.movementY / 256.0), zoom);
      const lng = tile2lng(lng2tile(center.lng, zoom) - (e.movementX / 256.0), zoom);
      const result = new LatLng(lat, lng);
      props.onChangeCenterZoom(result, zoom);
    }
  }

  const handleWheel = (e: React.WheelEvent) => {
    if (e.deltaY > 0) {
      throttledOnChangeCenterZoom(center, zoom - 1);
    } else {
      const mousePos = pixelToLatLng(width, height, zoom, center, getMousePoint(containerRef.current!, e));
      const nextCenter = new LatLng(
        (center.lat + mousePos.lat) / 2,
        (center.lng + mousePos.lng) / 2
      )
      throttledOnChangeCenterZoom(nextCenter, zoom + 1);
    }
  };

  return (
    <MapProvider value={new ContextData(center, zoom, width, height)}>
      <div
        style={{ width, height, position: 'relative', overflow: 'hidden', ...style }}
        ref={containerRef}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseUp}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        {props.children}
      </div>
    </MapProvider>
  );
}

export default Map;
