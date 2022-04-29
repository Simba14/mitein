import React from 'react';
import { render, screen } from 'testUtils';
import Loading from './loading';

test('Loading renders correctly', () => {
  render(<Loading />);
  const logo = screen.getByTestId('svg');
  expect(logo).toBeInTheDocument();
});
