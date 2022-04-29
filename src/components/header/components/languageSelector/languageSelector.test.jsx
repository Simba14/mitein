import React from 'react';
import { render, screen } from 'testUtils';
import LanguageSelector, { ACTIVE_LANG_ID } from './languageSelector';
import { ENGLISH, GERMAN } from '@constants/defaultOptions';
import { MOCK_SLUG } from 'unitTests/sharedMocks';

test('LanguageSelector correctly renders when on German page', () => {
  render(<LanguageSelector />, {
    router: { locale: GERMAN, pathname: MOCK_SLUG },
  });

  const link = screen.getByRole('link');
  const activeLanguage = screen.getByTestId(ACTIVE_LANG_ID);
  expect(link).toHaveTextContent(ENGLISH);
  expect(link).toHaveAttribute('href', MOCK_SLUG);
  expect(activeLanguage).toHaveTextContent(GERMAN);
});

test('LanguageSelector correctly renders when on English page', () => {
  render(<LanguageSelector />, {
    router: { locale: ENGLISH, pathname: MOCK_SLUG },
  });

  const link = screen.getByRole('link');
  const activeLanguage = screen.getByTestId(ACTIVE_LANG_ID);
  expect(link).toHaveTextContent(GERMAN);
  expect(link).toHaveAttribute('href', MOCK_SLUG);
  expect(activeLanguage).toHaveTextContent(ENGLISH);
});
