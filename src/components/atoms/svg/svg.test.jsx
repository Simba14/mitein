import React from 'react';
import { render, screen } from 'testUtils';
import Svg, { FB } from './svg';

test('Svg should render correct icon with label', () => {
  const { container } = render(<Svg name={FB} />);

  const svg = screen.getByTestId('svg');
  expect(svg).toBeInTheDocument();
  expect(container).toHaveTextContent(FB);
});

test('Svg should only render label without icon if name is not valid', () => {
  const { container } = render(<Svg name="invalid" />);

  const svg = screen.queryByTestId('svg');
  expect(svg).not.toBeInTheDocument();
  expect(container).toHaveTextContent('invalid');
});
