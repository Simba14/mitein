import React from 'react';
import { render, screen, userEvent } from 'testUtils';
import { Menu } from './menu';
import { MenuContextProvider } from 'context/menu';
import { ROUTE_ABOUT, ROUTE_HOW, ROUTE_VOLUNTEER } from 'routes';
import { MOCK_ID } from 'unitTests/sharedMocks';

const MOCK_SESSION = {
  userId: MOCK_ID,
  userLoggedOut: jest.fn(),
};

test('Menu renders correctly when not logged in and is closed by default', () => {
  render(
    <MenuContextProvider>
      <Menu />
    </MenuContextProvider>,
  );
  const toggle = screen.getByRole('button');
  const icon = screen.getByTestId('svg');
  const nav = screen.getByRole('navigation');
  const [about, how, volunteer] = screen.getAllByRole('link');

  expect(toggle).toBeInTheDocument();
  expect(toggle).toContainElement(icon);
  expect(toggle).not.toHaveClass('isOpen');

  expect(nav).not.toHaveClass('isOpen');
  expect(nav).toContainElement(about);
  expect(nav).toContainElement(how);
  expect(nav).toContainElement(volunteer);

  expect(about).toHaveAttribute('href', ROUTE_ABOUT);
  expect(how).toHaveAttribute('href', ROUTE_HOW);
  expect(volunteer).toHaveAttribute('href', ROUTE_VOLUNTEER.slice(0, -1));
});

test('Menu renders correctly when logged in and is closed by default', () => {
  render(
    <MenuContextProvider>
      <Menu session={MOCK_SESSION} />
    </MenuContextProvider>,
  );
  const [toggle] = screen.getAllByRole('button');
  const icon = screen.getByTestId('svg');
  const nav = screen.getByRole('navigation');
  const [about, how, volunteer] = screen.getAllByRole('link');

  expect(toggle).toBeInTheDocument();
  expect(toggle).toContainElement(icon);
  expect(toggle).not.toHaveClass('isOpen');

  expect(nav).not.toHaveClass('isOpen');
  expect(nav).toContainElement(about);
  expect(nav).toContainElement(how);
  expect(nav).toContainElement(volunteer);

  expect(about).toHaveAttribute('href', ROUTE_ABOUT);
  expect(how).toHaveAttribute('href', ROUTE_HOW);
  expect(volunteer).toHaveAttribute('href', ROUTE_VOLUNTEER.slice(0, -1));
});

test('Menu can be closed and reopened', () => {
  render(
    <MenuContextProvider>
      <Menu />
    </MenuContextProvider>,
  );
  const toggle = screen.getByRole('button');
  const icon = screen.getByTestId('svg');
  const nav = screen.getByRole('navigation');

  // open menu
  userEvent.click(toggle);
  expect(toggle).toContainElement(icon);
  expect(toggle).toHaveClass('isOpen');
  expect(nav).toHaveClass('isOpen');

  // close menu
  userEvent.click(toggle);
  expect(toggle).toContainElement(icon);
  expect(toggle).not.toHaveClass('isOpen');
  expect(nav).not.toHaveClass('isOpen');
});
