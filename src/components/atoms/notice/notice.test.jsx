import React from 'react';
import { render, screen } from 'testUtils';
import { MOCK_TEXT } from 'unitTests/sharedMocks';
import Notice, { NOTICE_TYPES } from './notice';

test('Notice renders correctly', () => {
  render(<Notice>{MOCK_TEXT}</Notice>);

  const text = screen.getByText(MOCK_TEXT);
  expect(text).toBeInTheDocument();
  expect(text).toHaveClass('default');
});

NOTICE_TYPES.forEach(type => {
  test(`${type} type renders with correct classname`, () => {
    render(<Notice type={type}>{MOCK_TEXT}</Notice>);

    const text = screen.getByText(MOCK_TEXT);
    expect(text).toBeInTheDocument();
    expect(text).toHaveClass(type);
  });
});
