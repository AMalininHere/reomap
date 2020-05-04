import React, { useRef, useCallback, useState, useEffect } from 'react';
import { lng2tile, lat2tile, tile2lat, tile2lng } from './utils/geo-fns';
import { pixelToLatLng } from './common';
import { Point, LatLng } from './models';
import { MapProvider, ContextData } from './Context';
import { useThrottleCallback, useSyncRef } from './utils/hooks';

function getMousePoint(domElement: HTMLElement, event: React.MouseEvent) {
  const elementRect = domElement.getBoundingClientRect();
  return new Point(
    event.clientX - elementRect.left,
    event.clientY - elementRect.top
  );
}

export interface Props {
  style?: React.CSSProperties;

  zoom: number;
  center: LatLng;
  onChangeCenterZoom?: (center: LatLng, zoom: number) => any;
  children: React.ReactNode | React.ReactNode[]
}

function noop() {}

function Map(props: Props) {
  const {
    style,
    zoom,
    center,
    onChangeCenterZoom = noop,
  } = props;

  const containerRef = useRef<HTMLDivElement>(null);
  const [ widthHeight, setWidthHeight ] = useState(new Point(0, 0));

  useEffect(() => {
    const updateSize = () => {
      const rect = containerRef.current!.getBoundingClientRect();
      setWidthHeight(p => {
        if (p.x === rect.width && p.y === rect.height) {
          return p;
        }
        return new Point(rect.width, rect.height);
      });
    };

    updateSize();

    window.addEventListener('resize', updateSize);

    return () => {
      window.removeEventListener('resize', updateSize);
    };

  }, []);


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
      const lat = tile2lat(lat2tile(center.lat, zoom) - (e.movementY / 256.0), zoom);
      const lng = tile2lng(lng2tile(center.lng, zoom) - (e.movementX / 256.0), zoom);
      const result = new LatLng(lat, lng);
      props.onChangeCenterZoom(result, zoom);
    }
  });

  const handleWheel = (e: React.WheelEvent) => {
    if (e.deltaY > 0) {
      throttledOnChangeCenterZoom(center, zoom - 1);
    } else {
      const mousePos = pixelToLatLng(widthHeight.x, widthHeight.y, zoom, center, getMousePoint(containerRef.current!, e));
      const nextCenter = new LatLng(
        (center.lat + mousePos.lat) / 2,
        (center.lng + mousePos.lng) / 2
      )
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
  }, []);

  return (
    <MapProvider value={new ContextData(center, zoom, widthHeight.x, widthHeight.y)}>
      <div
        style={{ position: 'relative', overflow: 'hidden', ...style }}
        ref={containerRef}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
      >
        {props.children}
      </div>
    </MapProvider>
  );
}

export default Map;
