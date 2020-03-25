import React from 'react';

interface Props {
  children?: React.ReactNode | React.ReactNode[];
}

function Layer({ children }: Props) {
  return (
    <div style={{ left: 0, top: 0, position: 'absolute' }}>
      {children}
    </div>
  );
}

export default Layer;
