import React, { useRef, useCallback, useEffect } from 'react';
import { lng2tile, lat2tile, tile2lat, tile2lng } from './utils/geo-fns';
import { MapProvider, createContextState } from './context';
import { TILE_SIZE, LatLng, point, latLng, latLngToPixel, pixelToLatLng } from './common';
import { useThrottleCallback, useSyncRef, useContainerWidthHeight } from './utils/hooks';

function getMousePoint(domElement: HTMLElement, event: React.MouseEvent | MouseEvent) {
  const elementRect = domElement.getBoundingClientRect();
  return point(
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
  const mapContextData = createContextState(center, zoom, width, height);

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
      const result = latLng(lat, lng);
      props.onChangeCenterZoom(result, zoom);
    }
  });

  const handleWheelRef = useSyncRef((e: WheelEvent) => {
    e.preventDefault();
    const mouseLatLng = mapContextData.pixelToLatLng(getMousePoint(containerRef.current!, e));

    let newZoom = mapContextData.zoom;

    if (e.deltaY > 0) {
      newZoom = newZoom - 1;
    } else {
      newZoom = newZoom + 1;
    }

    const pixelBefore = latLngToPixel(width, height, zoom, center, mouseLatLng);
    const pixelAfter = latLngToPixel(width, height, newZoom, center, mouseLatLng);

    const newCenter = pixelToLatLng(width, height, newZoom, center, point(
      width / 2 + pixelAfter.x - pixelBefore.x,
      height / 2 + pixelAfter.y - pixelBefore.y
    ));

    throttledOnChangeCenterZoom(newCenter, newZoom);
  });

  useEffect(() => {
    const container = containerRef.current;

    const handleMove = (e: MouseEvent) => mouseMoveRef.current(e);
    const handleUp = (e: MouseEvent) => mouseUpRef.current(e);
    const handleWheel = (e: WheelEvent) => handleWheelRef.current(e);

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
    container?.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
      container?.removeEventListener('wheel', handleWheel);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      style={{ position: 'relative', overflow: 'hidden', ...style }}
      className={className}
      ref={containerRef}
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
