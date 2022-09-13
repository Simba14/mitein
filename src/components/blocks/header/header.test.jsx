import React from 'react';
import { ROUTE_BASE, ROUTE_LOGIN, ROUTE_SIGN_UP } from 'routes';
import { SessionContextProvider } from 'context/session';
import { render, screen } from 'testUtils';
import { MOCK_SESSION_VARS } from 'unitTests/sharedMocks';
import Header from './header';

const MENU_TEST_ID = 'menu';
const LANGUAGE_SELECTOR_TEST_ID = 'languageSelector';

jest.mock('components/blocks/menu', () => {
  const Menu = () => <div data-testid={MENU_TEST_ID} />;
  return Menu;
});

jest.mock('components/blocks/header/components/languageSelector', () => {
  const LanguageSelector = () => (
    <div data-testid={LANGUAGE_SELECTOR_TEST_ID} />
  );
  return LanguageSelector;
});

test('Header renders correctly', () => {
  render(
    <SessionContextProvider {...MOCK_SESSION_VARS}>
      <Header />
    </SessionContextProvider>,
  );
  const header = screen.getByRole('banner');
  const [homeLink, signUpLink, loginLink] = screen.getAllByRole('link');
  const [logo, profileIcon] = screen.getAllByTestId('svg');

  expect(header).toBeInTheDocument();
  expect(header).toContainElement(screen.getByTestId(MENU_TEST_ID));
  expect(header).toContainElement(
    screen.getByTestId(LANGUAGE_SELECTOR_TEST_ID),
  );
  expect(header).toContainElement(homeLink);

  expect(homeLink).toContainElement(logo);
  expect(homeLink).toHaveAttribute('href', ROUTE_BASE);

  expect(signUpLink).toContainElement(profileIcon);
  expect(signUpLink).toHaveAttribute('href', ROUTE_SIGN_UP.slice(0, -1));
  expect(loginLink).toHaveAttribute('href', ROUTE_LOGIN.slice(0, -1));
});
