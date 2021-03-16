import React, { ComponentProps } from 'react';
import { render } from '@testing-library/react';

import TileLayer from '../TileLayer';
import Tile from '../Tile';

import { MapProvider, createContextState } from '../context';
import { latLng } from '../common';

jest.mock('../Tile', () => (props: ComponentProps<typeof Tile>) => <img {...props}/>);

describe('TileLayer', () => {
  const tileProvider: ComponentProps<typeof TileLayer>['provider'] = (x, y, z) => `tile-${x}-${y}-${z}`;

  it('should render tiles', () => {

    const contextState = createContextState(latLng(55.417, 85.276), 6, 800, 600);

    const { container } = render(
      <MapProvider value={contextState}>
        <TileLayer provider={tileProvider}/>
      </MapProvider>
    );

    expect(container).toMatchSnapshot();
  });
});
