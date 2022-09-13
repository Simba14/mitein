import React from 'react';
import { render, screen } from 'testUtils';
import { LoadingLogo } from './loading';

test('Loading renders correctly', () => {
  render(<LoadingLogo />);
  const logo = screen.getByTestId('svg');
  expect(logo).toBeInTheDocument();
});
