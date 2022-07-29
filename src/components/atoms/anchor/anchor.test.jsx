import React from 'react';
import { render, screen } from 'testUtils';
import { MOCK_TEXT, MOCK_SLUG, MOCK_URL } from 'unitTests/sharedMocks';
import Anchor from './anchor';

test('Anchor renders correctly when href provided', () => {
  render(<Anchor href={MOCK_URL}>{MOCK_TEXT}</Anchor>);
  const link = screen.getByRole('link');
  expect(link.textContent).toEqual(MOCK_TEXT);
  expect(link).toHaveAttribute('href', MOCK_URL);
  expect(link).not.toHaveClass('underlined');
});

test('Anchor has correct classname when underlined', () => {
  render(
    <Anchor href={MOCK_URL} underlined>
      {MOCK_TEXT}
    </Anchor>,
  );
  const link = screen.getByRole('link');
  expect(link.textContent).toEqual(MOCK_TEXT);
  expect(link).toHaveAttribute('href', MOCK_URL);
  expect(link).toHaveClass('underlined');
});

test('Anchor renders correctly when to provided', () => {
  render(<Anchor to={MOCK_SLUG}>{MOCK_TEXT}</Anchor>);
  const link = screen.getByRole('link');
  expect(link.textContent).toEqual(MOCK_TEXT);
  expect(link).toHaveAttribute('href', MOCK_SLUG);
});
