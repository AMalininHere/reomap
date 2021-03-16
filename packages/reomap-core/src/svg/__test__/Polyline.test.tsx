import React from 'react';
import { render } from '@testing-library/react';
import Polyline from '../Polyline';
import { SvgLayerProvider } from '../context';
import { createContextState } from '../../context';
import { latLng } from '../../common';

describe('Polyline', () => {
  it('should render', () => {
    const contextState = createContextState(latLng(55.417, 85.276), 6, 800, 600);

    const geojsonLinePath: [number, number][] = [
      [
        82.935791015625,
        55.02802211299252
      ],
      [
        84.8583984375,
        55.78892895389262
      ],
      [
        86.099853515625,
        55.36662484928637
      ],
      [
        86.209716796875,
        54.67383096593114
      ],
      [
        86.737060546875,
        53.93021986394
      ],
      [
        87.154541015625,
        53.72271667491848
      ]
    ];

    const { container } = render(
      <svg>
        <SvgLayerProvider value={contextState}>
          <Polyline positions={geojsonLinePath.map(([lng, lat]) => latLng(lat, lng))}/>
        </SvgLayerProvider>
      </svg>
    );

    expect(container).toMatchSnapshot();
  });
});
