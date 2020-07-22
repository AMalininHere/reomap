import React, { useState } from 'react';
import { latLng, Map, TileLayer } from '@reomap/core';
import GeoJson from './GeoJson';

import data from './test.json';

function osm(x: number, y: number, z: number) {
  const s = String.fromCharCode(97 + (x + y + z) % 3)
  return `https://${s}.tile.openstreetmap.org/${z}/${x}/${y}.png`
}

function App() {
  const [center, setCenter] = useState(latLng(55.417, 85.276));
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
        <TileLayer provider={osm} />
        <GeoJson data={data as GeoJSON.GeoJSON} />
      </Map>
      <div>
        <div>center: ({center.lat}, {center.lng})</div>
        <div>zoom: {zoom}</div>
      </div>
    </div>
  );
}

export default App;
