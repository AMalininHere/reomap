import React, { useState } from 'react';

import Map from './core/Map';
import { LatLng } from './core/models';

function App() {
  const [center, setCenter] = useState(new LatLng(55.417, 85.276));
  const [zoom, setZoom] = useState(6);

  return (
    <div>
      <Map
        zoom={zoom}
        center={center}
        onChangeCenterZoom={(c, z) => {
          setCenter(c);
          setZoom(z);
        }}
        width={800}
        height={500}
      />
      <div>
        <span>zoom: {zoom}</span>
      </div>
    </div>
  );
}

export default App;
