import React from 'react';
import { render, renderWithUser, screen } from 'testUtils';
import Link from './link';
import { MOCK_CLASSNAME, MOCK_TEXT, MOCK_SLUG } from 'unitTests/sharedMocks';

const ACTIVE_CLASSNAME = 'active';

test('Link renders correctly when "to" provided', () => {
  render(<Link to={MOCK_SLUG}>{MOCK_TEXT}</Link>);
  const link = screen.getByRole('link');
  expect(link.textContent).toEqual(MOCK_TEXT);
  expect(link).toHaveAttribute('href', MOCK_SLUG);
});

test('Link on click should call function', async () => {
  const onClick = jest.fn();
  const { user } = renderWithUser(
    <Link to={MOCK_SLUG} onClick={onClick}>
      {MOCK_TEXT}
    </Link>,
  );
  const link = screen.getByRole('link');
  await user.click(link);
  expect(onClick).toHaveBeenCalled();
});

test('Link should not have active classname if on a different path', () => {
  render(
    <Link
      activeClassName={ACTIVE_CLASSNAME}
      className={MOCK_CLASSNAME}
      to={MOCK_SLUG}
    >
      {MOCK_TEXT}
    </Link>,
  );

  const link = screen.getByRole('link');
  expect(link).toHaveClass(MOCK_CLASSNAME);
  expect(link).not.toHaveClass(ACTIVE_CLASSNAME);
});

test('Link should have active classname if on the same path', () => {
  render(
    <Link
      activeClassName={ACTIVE_CLASSNAME}
      className={MOCK_CLASSNAME}
      to={MOCK_SLUG}
    >
      {MOCK_TEXT}
    </Link>,
    { router: { asPath: MOCK_SLUG } },
  );

  const link = screen.getByRole('link');
  expect(link).toHaveClass(MOCK_CLASSNAME);
  expect(link).toHaveClass(ACTIVE_CLASSNAME);
});
