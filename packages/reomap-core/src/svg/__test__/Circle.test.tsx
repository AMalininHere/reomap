import React from 'react';
import { render } from '@testing-library/react';
import Circle from '../Circle';
import { SvgLayerProvider } from '../context';
import { createContextState } from '../../context';
import { latLng } from '../../common';

describe('Circle', () => {
  it('should render', () => {
    const contextState = createContextState(latLng(55.417, 85.276), 6, 800, 600);

    const { container } = render(
      <svg>
        <SvgLayerProvider value={contextState}>
          <Circle center={latLng(53.72271667491848, 87.154541015625)} radius={5} />
        </SvgLayerProvider>
      </svg>
    );

    expect(container).toMatchSnapshot();
  });
});
