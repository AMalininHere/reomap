import React, { useState, Ref, useCallback } from 'react';

type Props = React.ImgHTMLAttributes<HTMLImageElement>;

function Tile({ style, onLoad, ...props }: Props, ref: Ref<HTMLImageElement>) {
  const [ loaded, setLoaded ] = useState(false);

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
    <img ref={ref} style={style} onLoad={handleLoad} {...props}/>
  );
}

export default React.forwardRef(Tile);
