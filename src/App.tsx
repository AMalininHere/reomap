import React, { useState } from 'react';

import data from './test.json';
import { LatLng, Map, Tiles, GeoJson, Layer, Marker } from './core';

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
        zoom={zoom}
        center={center}
        onChangeCenterZoom={(c, z) => {
          if (z > 4 && z < 16) {
            setCenter(c);
            setZoom(z);
          }
        }}
        width={800}
        height={500}
      >
        <Tiles provider={wikimedia} />
        <GeoJson data={data as GeoJSON.GeoJSON} />
        <Layer>
          <Marker pos={new LatLng(55.02802211299252, 82.935791015625)} />
          <Marker pos={new LatLng(53.72271667491848, 87.154541015625)} />
        </Layer>
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
