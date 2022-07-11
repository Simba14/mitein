import { SessionContextProvider } from 'context/session';
import React from 'react';
import { render, screen } from 'testUtils';
import { mockT, MOCK_SESSION_VARS } from 'unitTests/sharedMocks';
import { ErrorBoundary } from './errorBoundary';

test('ErrorBoundary renders children when no error', () => {
  const mockTestId = 'mockTestId';
  const Child = () => <div data-testid={mockTestId} />;
  render(
    <ErrorBoundary t={mockT}>
      <Child />
    </ErrorBoundary>,
  );
  const children = screen.getByTestId(mockTestId);
  expect(children).toBeVisible();
});

// Throwing an error in the test so need to silence console.error
beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

test('ErrorBoundary renders error UI when error in child', () => {
  const mockTestId = 'mockTestId';
  const Child = () => {
    throw new Error();
    return <div data-testid={mockTestId} />; // eslint-disable-line no-unreachable
  };

  render(
    <SessionContextProvider {...MOCK_SESSION_VARS}>
      <ErrorBoundary t={mockT}>
        <Child />
      </ErrorBoundary>
    </SessionContextProvider>,
  );
  const children = screen.queryByTestId(mockTestId);
  expect(children).toBeNull();

  const cta = screen.getByText('error.cta');
  const link = screen.getByText('error.link');
  const title = screen.getByText('error.title');

  expect(cta).toBeVisible();
  expect(link).toBeVisible();
  expect(title).toBeVisible();
});
