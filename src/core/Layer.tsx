import React from 'react';

interface Props {
  children?: React.ReactNode | React.ReactNode[];
}

function Layer({ children }: Props) {
  return (
    <div style={{ width: '100%', height: '100%', position: 'absolute' }}>
      {children}
    </div>
  );
}

export default Layer;
