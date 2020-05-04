import React, { useState } from 'react';

import data from './test.json';
import { LatLng, Map, Tiles, GeoJson } from './core';

function osm(x: number, y: number, z: number) {
  const s = String.fromCharCode(97 + (x + y + z) % 3)
  return `https://${s}.tile.openstreetmap.org/${z}/${x}/${y}.png`
}


function ocm(x: number, y: number, z: number) {
  const s = String.fromCharCode(97 + (x + y + z) % 3)
  return `https://${s}.tile.thunderforest.com/cycle/${z}/${x}/${y}.png`
}

function wikimedia(x: number, y: number, z: number) {
  return `https://maps.wikimedia.org/osm-intl/${z}/${x}/${y}.png`;
}

function App() {
  const [center, setCenter] = useState(new LatLng(55.417, 85.276));
  const [zoom, setZoom] = useState(6);

  return (
    <div>
      <Map
        style={{ margin: '0 auto', width: 800, height: 600 }}
        zoom={zoom}
        center={center}
        onChangeCenterZoom={(c, z) => {
          if (z > 4 && z < 16) {
            setCenter(c);
            setZoom(z);
          }
        }}
      >
        <Tiles provider={wikimedia} />
        <GeoJson data={data as GeoJSON.GeoJSON} />
      </Map>
      <div>
        <span>zoom: {zoom}</span>
        <button onClick={() => setZoom(z => z + 1)}>+</button>
        <button onClick={() => setZoom(z => z - 1)}>-</button>
      </div>
    </div>
  );
}

export default App;
