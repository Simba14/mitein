import React from 'react';
import { render, screen } from 'testUtils';
import { MOCK_START_EN } from 'unitTests/sharedMocks';
import Suspended from './suspended';

test('Suspended renders correctly', () => {
  render(<Suspended suspendedUntil={MOCK_START_EN} />);

  const date = screen.getByText('until');
  const note = screen.getByText('note');
  expect(date).toBeInTheDocument();
  expect(note).toBeInTheDocument();
});
