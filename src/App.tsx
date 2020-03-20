import React, { useState } from 'react';

import Map from './core/Map';
import { LatLng } from './core/models';
import Tiles from './core/Tiles';

function osm(x: number, y: number, z: number) {
  const s = String.fromCharCode(97 + (x + y + z) % 3)
  return `https://${s}.tile.openstreetmap.org/${z}/${x}/${y}.png`
}


function ocm(x: number, y: number, z: number) {
  const s = String.fromCharCode(97 + (x + y + z) % 3)
  return `https://${s}.tile.thunderforest.com/cycle/${z}/${x}/${y}.png`
}

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
      >
        <Tiles provider={ocm} />
      </Map>
      <div>
        <span>zoom: {zoom}</span>
      </div>
    </div>
  );
}

export default App;
