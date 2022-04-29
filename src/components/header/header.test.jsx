import React from 'react';
import { ROUTE_BASE } from 'routes';
import { render, screen } from 'testUtils';
import Header from './header';

const MENU_TEST_ID = 'menu';
const LANGUAGE_SELECTOR_TEST_ID = 'languageSelector';

jest.mock('components/menu', () => {
  const Menu = () => <div data-testid={MENU_TEST_ID} />;
  return Menu;
});

jest.mock('components/header/components/languageSelector', () => {
  const LanguageSelector = () => (
    <div data-testid={LANGUAGE_SELECTOR_TEST_ID} />
  );
  return LanguageSelector;
});

test('Header renders correctly', () => {
  render(<Header />);
  const header = screen.getByRole('banner');
  const homeLink = screen.getByRole('link');
  const logo = screen.getByTestId('svg');

  expect(header).toBeInTheDocument();
  expect(header).toContainElement(screen.getByTestId(MENU_TEST_ID));
  expect(header).toContainElement(
    screen.getByTestId(LANGUAGE_SELECTOR_TEST_ID),
  );
  expect(header).toContainElement(homeLink);

  expect(homeLink).toContainElement(logo);
  expect(homeLink).toHaveAttribute('href', ROUTE_BASE);
});
