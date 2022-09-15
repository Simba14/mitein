import React from 'react';
import { render, renderWithUser, screen } from 'testUtils';
import { Menu } from './menu';
import { MenuContextProvider } from 'context/menu';
import {
  ROUTE_ABOUT,
  ROUTE_HOW,
  ROUTE_VOLUNTEER,
  ROUTE_SIGN_UP,
  ROUTE_RESOURCES,
} from 'routes';
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
  const [about, how, resources, volunteer, signUp] =
    screen.getAllByRole('link');

  expect(toggle).toBeInTheDocument();
  expect(toggle).toContainElement(icon);
  expect(toggle).not.toHaveClass('isOpen');

  expect(nav).not.toHaveClass('isOpen');
  expect(nav).toContainElement(about);
  expect(nav).toContainElement(how);
  expect(nav).toContainElement(resources);
  expect(nav).toContainElement(volunteer);
  expect(nav).toContainElement(signUp);

  expect(about).toHaveAttribute('href', ROUTE_ABOUT);
  expect(how).toHaveAttribute('href', ROUTE_HOW);
  expect(resources).toHaveAttribute('href', ROUTE_RESOURCES.slice(0, -1));
  expect(volunteer).toHaveAttribute('href', ROUTE_VOLUNTEER.slice(0, -1));
  expect(signUp).toHaveAttribute('href', ROUTE_SIGN_UP.slice(0, -1));
});

test('Menu renders correctly when logged in and is closed by default', () => {
  render(
    <MenuContextProvider>
      <Menu session={MOCK_SESSION} />
    </MenuContextProvider>,
  );
  const [toggle, signOut] = screen.getAllByRole('button');
  const icon = screen.getByTestId('svg');
  const nav = screen.getByRole('navigation');
  const [about, how, resources, volunteer] = screen.getAllByRole('link');

  expect(toggle).toBeInTheDocument();
  expect(toggle).toContainElement(icon);
  expect(toggle).not.toHaveClass('isOpen');

  expect(nav).not.toHaveClass('isOpen');
  expect(nav).toContainElement(about);
  expect(nav).toContainElement(how);
  expect(nav).toContainElement(volunteer);
  expect(nav).toContainElement(resources);
  expect(nav).toContainElement(signOut);

  expect(about).toHaveAttribute('href', ROUTE_ABOUT);
  expect(how).toHaveAttribute('href', ROUTE_HOW);
  expect(resources).toHaveAttribute('href', ROUTE_RESOURCES.slice(0, -1));
  expect(volunteer).toHaveAttribute('href', ROUTE_VOLUNTEER.slice(0, -1));
});

test('Menu can be closed and reopened', async () => {
  const { user } = renderWithUser(
    <MenuContextProvider>
      <Menu />
    </MenuContextProvider>,
  );
  const toggle = screen.getByRole('button');
  const icon = screen.getByTestId('svg');
  const nav = screen.getByRole('navigation');

  // open menu
  await user.click(toggle);
  expect(toggle).toContainElement(icon);
  expect(toggle).toHaveClass('isOpen');
  expect(nav).toHaveClass('isOpen');

  // close menu
  await user.click(toggle);
  expect(toggle).toContainElement(icon);
  expect(toggle).not.toHaveClass('isOpen');
  expect(nav).not.toHaveClass('isOpen');
});
