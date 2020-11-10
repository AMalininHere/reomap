import React, { PropsWithChildren } from 'react';

interface Props {
  className?: string;
}

function Layer({ className, children }: PropsWithChildren<Props>) {
  return (
    <div style={{ left: 0, top: 0, position: 'absolute' }} className={className}>
      {children}
    </div>
  );
}

export default Layer;
