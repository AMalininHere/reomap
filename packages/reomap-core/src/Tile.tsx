import React, { useState, useCallback, useEffect, useRef, forwardRef } from 'react';

type Props = React.ImgHTMLAttributes<HTMLImageElement>;

const Tile = forwardRef<HTMLImageElement, Props>(function Tile({ style, onLoad, src, ...props }, ref) {
  const [ loaded, setLoaded ] = useState(false);

  const prevSrc = useRef(src);

  useEffect(() => {
    if (prevSrc.current !== src) {
      setLoaded(false);
    }

    prevSrc.current = src;
  }, [src]);

  const handleLoad = useCallback<NonNullable<Props['onLoad']>>(e => {
    setLoaded(true);
    return onLoad?.(e);
  }, [ onLoad ]);

  if (!loaded) {
    style = {
      ...style,
      visibility: 'hidden'
    };
  }

  return (
    <img ref={ref} style={style} onLoad={handleLoad} src={src} {...props}/>
  );
});

export default Tile;
