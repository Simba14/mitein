import React from 'react';
import { render, screen } from 'testUtils';
import { MOCK_TEXT } from 'unitTests/sharedMocks';
import Text, { BODY_5, HEADING_1 } from './text';

test('Text renders a p tag by default', () => {
  render(<Text>{MOCK_TEXT}</Text>);
  const p = screen.getByText(MOCK_TEXT);

  expect(p).toBeInTheDocument();
  expect(p).toHaveTextContent(MOCK_TEXT);
  expect(p.classList.contains(BODY_5)).toBe(true);
});

test('Text renders a heading correctly', () => {
  render(
    <Text tag="h1" type={HEADING_1}>
      {MOCK_TEXT}
    </Text>,
  );
  const heading = screen.getByRole('heading', { level: 1 });

  expect(heading).toBeInTheDocument();
  expect(heading).toHaveTextContent(MOCK_TEXT);
  expect(heading.classList.contains(HEADING_1)).toBe(true);
});
