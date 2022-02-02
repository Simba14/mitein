import React from 'react';
import { render, screen, waitFor } from 'testUtils';
import { MOCK_EMAIL } from 'unitTests/sharedMocks';
import AccountSection from './accountSection';
import GET_EMAIL from '@graphql/queries/getEmail.graphql';
import { ROUTE_LOGIN, ROUTE_PROFILE, ROUTE_SIGN_UP } from 'routes';

const USER_ID_MOCK = '1';
const VALID_EMAIL_MOCK = {
  request: {
    query: GET_EMAIL,
    variables: {
      id: USER_ID_MOCK,
    },
  },
  result: {
    data: {
      user: { id: USER_ID_MOCK, email: MOCK_EMAIL },
    },
  },
};

const INVALID_EMAIL_MOCK = {
  request: {
    query: GET_EMAIL,
    variables: {
      id: USER_ID_MOCK,
    },
  },
  result: {
    data: { user: null },
  },
};

test('AccountSection correctly renders when user logged in and loading', () => {
  const sessionMock = { userId: USER_ID_MOCK };
  render(<AccountSection session={sessionMock} />, {
    mocks: [VALID_EMAIL_MOCK],
  });
  const links = screen.queryAllByRole('link');
  const accountIcon = screen.queryByTestId('svg');
  expect(links).toEqual([]);
  expect(accountIcon).not.toBeInTheDocument();
});

test('AccountSection correctly renders when user logged in and valid response', async () => {
  const sessionMock = { userId: USER_ID_MOCK };
  render(<AccountSection session={sessionMock} />, {
    mocks: [VALID_EMAIL_MOCK],
  });

  // ensure loading is finished
  await waitFor(() => new Promise(resolve => setTimeout(resolve, 0)));
  const link = screen.getByRole('link');
  const accountIcon = screen.getByTestId('svg');
  expect(accountIcon).toBeInTheDocument();
  expect(link.textContent).toEqual(MOCK_EMAIL);
  expect(link).toHaveAttribute('href', ROUTE_PROFILE.slice(0, -1));
});

test('AccountSection correctly renders when userId exists but with invalid response', async () => {
  const sessionMock = { userId: USER_ID_MOCK };
  render(<AccountSection session={sessionMock} />, {
    mocks: [INVALID_EMAIL_MOCK],
  });

  // ensure loading is finished
  await waitFor(() => new Promise(resolve => setTimeout(resolve, 0)));
  const [signUp, login] = screen.queryAllByRole('link');
  const accountIcon = screen.queryByTestId('svg');
  expect(signUp).toHaveTextContent('signUp');
  expect(signUp).toContainElement(accountIcon);
  expect(signUp).toHaveAttribute('href', ROUTE_SIGN_UP.slice(0, -1));
  expect(login).toHaveTextContent('login');
  expect(login).toHaveAttribute('href', ROUTE_LOGIN.slice(0, -1));
});

test('AccountSection correctly renders when user not logged in', () => {
  const sessionMock = { userId: null };
  render(<AccountSection session={sessionMock} />);
  const [signUp, login] = screen.queryAllByRole('link');
  const accountIcon = screen.queryByTestId('svg');
  expect(signUp).toHaveTextContent('signUp');
  expect(signUp).toContainElement(accountIcon);
  expect(signUp).toHaveAttribute('href', ROUTE_SIGN_UP.slice(0, -1));
  expect(login).toHaveTextContent('login');
  expect(login).toHaveAttribute('href', ROUTE_LOGIN.slice(0, -1));
});
