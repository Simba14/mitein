import React from 'react';
import { render, screen } from 'testUtils';
import Hero from './hero';

test('Hero renders correctly', () => {
  render(<Hero />);
  const heading = screen.getByRole('heading', { level: 2 });
  const logo = screen.getByTestId('svg');

  expect(heading).toBeInTheDocument();
  expect(heading).toHaveTextContent('description');
  expect(logo).toBeInTheDocument();
});
