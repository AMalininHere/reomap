import React, { useState, Ref, useCallback, useEffect, useRef } from 'react';

type Props = React.ImgHTMLAttributes<HTMLImageElement>;

function Tile({ style, onLoad, src, ...props }: Props, ref: Ref<HTMLImageElement>) {
  const [ loaded, setLoaded ] = useState(false);

  const prevSrc = useRef(src);

  useEffect(() => {
    if (prevSrc.current !== src) {
      setLoaded(false);
    }

    prevSrc.current = src;
  }, [src]);

  const handleLoad = useCallback<Required<Props>['onLoad']>(e => {
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
}

export default React.forwardRef(Tile);
