import React, { useRef, useCallback, useEffect } from 'react';
import { lng2tile, lat2tile, tile2lat, tile2lng } from './utils/geo-fns';
import { Point, LatLng } from './models';
import { MapProvider, ContextData } from './Context';
import { TILE_SIZE } from './common';
import { useThrottleCallback, useSyncRef, useContainerWidthHeight } from './utils/hooks';

function getMousePoint(domElement: HTMLElement, event: React.MouseEvent) {
  const elementRect = domElement.getBoundingClientRect();
  return new Point(
    event.clientX - elementRect.left,
    event.clientY - elementRect.top
  );
}

export interface Props {
  style?: React.CSSProperties;
  className?: string;

  zoom: number;
  center: LatLng;
  onChangeCenterZoom?: (center: LatLng, zoom: number) => any;
  children: React.ReactNode | React.ReactNode[]
}

function noop() { }

function Map(props: Props) {
  const {
    style,
    className,
    zoom,
    center,
    onChangeCenterZoom = noop,
  } = props;

  const containerRef = useRef<HTMLDivElement>(null);
  const [width, height] = useContainerWidthHeight(containerRef);
  const mapContextData = new ContextData(center, zoom, width, height);

  const moveStartedRef = useRef(false);
  const throttledOnChangeCenterZoom = useThrottleCallback(onChangeCenterZoom, 150);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) {
      return;
    }

    e.preventDefault();
    moveStartedRef.current = true;
  }, []);

  const mouseUpRef = useSyncRef((e: MouseEvent) => {
    if (moveStartedRef.current) {
      e.preventDefault();
      moveStartedRef.current = false;
    }
  });

  const mouseMoveRef = useSyncRef((e: MouseEvent) => {
    if (moveStartedRef.current && props.onChangeCenterZoom) {
      e.preventDefault();
      const lat = tile2lat(lat2tile(center.lat, zoom) - (e.movementY / TILE_SIZE), zoom);
      const lng = tile2lng(lng2tile(center.lng, zoom) - (e.movementX / TILE_SIZE), zoom);
      const result = new LatLng(lat, lng);
      props.onChangeCenterZoom(result, zoom);
    }
  });

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const mouseLatLng = mapContextData.pixelToLatLng(getMousePoint(containerRef.current!, e));
    const diffLat = (mouseLatLng.lat - center.lat);
    const diffLng = (mouseLatLng.lng - center.lng);
    if (e.deltaY > 0) {
      const nextCenter = new LatLng(
        (center.lat - diffLat),
        (center.lng - diffLng)
      );
      throttledOnChangeCenterZoom(nextCenter, zoom - 1);
    } else {
      const nextCenter = new LatLng(
        (center.lat + diffLat / 2),
        (center.lng + diffLng / 2)
      );
      throttledOnChangeCenterZoom(nextCenter, zoom + 1);
    }
  };

  useEffect(() => {
    const handleMove = (e: MouseEvent) => mouseMoveRef.current(e);
    const handleUp = (e: MouseEvent) => mouseUpRef.current(e);

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      style={{ position: 'relative', overflow: 'hidden', ...style }}
      className={className}
      ref={containerRef}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
    >
      {width > 0 && height > 0 && (
        <MapProvider value={mapContextData}>
          {props.children}
        </MapProvider>
      )}
    </div>
  );
}

export default Map;
