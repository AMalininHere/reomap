import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import Tile from '../Tile';

describe('Tile', () => {
  it('should render hidden <img/> on init', () => {
    const { container } = render(<Tile src="test-img"/>);
    const imgElement = container.firstChild as HTMLImageElement;

    expect(imgElement.style.visibility).toBe('hidden');
  });

  it('should render visible <img/> after loading', () => {
    const { container } = render(<Tile src="test-img" />);
    const imgElement = container.firstChild as HTMLImageElement;

    fireEvent.load(imgElement, {});

    expect(imgElement.style.visibility).toBe('');
  });
});
