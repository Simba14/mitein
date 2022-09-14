import React from 'react';
import { render, screen } from 'testUtils';
import { MOCK_TEXT } from 'unitTests/sharedMocks';
import TextBanner from './textBanner';

test('TextBanner renders correctly', () => {
  render(<TextBanner tag="h3">{MOCK_TEXT}</TextBanner>);

  const textBanner = screen.getByRole('heading', { level: 3 });
  expect(textBanner).toBeInTheDocument();
  expect(textBanner).toHaveTextContent(MOCK_TEXT);
});
