import React from 'react';

interface Props {
  className?: string;
  children?: React.ReactNode | React.ReactNode[];
}

function Layer({ className, children }: Props) {
  return (
    <div style={{ left: 0, top: 0, position: 'absolute' }} className={className}>
      {children}
    </div>
  );
}

export default Layer;
