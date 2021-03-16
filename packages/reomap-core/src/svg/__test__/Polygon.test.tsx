import React from 'react';
import { render } from '@testing-library/react';
import Polygon from '../Polygon';
import { SvgLayerProvider } from '../context';
import { createContextState } from '../../context';
import { latLng } from '../../common';

describe('Polygon', () => {
  it('should render', () => {
    const contextState = createContextState(latLng(55.417, 85.276), 6, 800, 600);

    const geojsonPolygonPath: [number, number][][] = [
      [
        [
          80.57373046875,
          54.28446875235516
        ],
        [
          82.913818359375,
          52.522905940278065
        ],
        [
          87.835693359375,
          52.94201777829491
        ],
        [
          88.78051757812499,
          55.53484823078213
        ],
        [
          82.716064453125,
          56.806893398067466
        ],
        [
          80.57373046875,
          54.28446875235516
        ]
      ],
      [
        [
          82.41943359374999,
          54.17529672404642
        ],
        [
          82.353515625,
          55.015425940562984
        ],
        [
          83.507080078125,
          55.83214387781303
        ],
        [
          85.440673828125,
          55.88763544617004
        ],
        [
          87.725830078125,
          55.45394132943305
        ],
        [
          87.396240234375,
          53.42262754609993
        ],
        [
          85.05615234375,
          53.11381149316827
        ],
        [
          82.41943359374999,
          54.17529672404642
        ]
      ]
    ];

    const { container } = render(
      <svg>
        <SvgLayerProvider value={contextState}>
          <Polygon positions={geojsonPolygonPath.map(line => line.map(([lng, lat]) => latLng(lat, lng)))}/>
        </SvgLayerProvider>
      </svg>
    );

    expect(container).toMatchSnapshot();
  });
});
