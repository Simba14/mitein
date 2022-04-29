import React from 'react';
import { ROUTE_PRIVACY, ROUTE_TERMS } from 'routes';
import { render, screen } from 'testUtils';
import Footer, { FB_URL, IG_URL, INFO_EMAIL } from './footer';

test('Footer renders correctly', () => {
  render(<Footer />);
  const footer = screen.getByRole('contentinfo');
  expect(footer).toBeInTheDocument();
  expect(footer).toHaveTextContent('miteinWithYear');

  const cookieBtn = screen.getByRole('button');
  expect(cookieBtn).toHaveTextContent('cookies');

  // links
  const [info, privacy, terms, facebook, instagram] =
    screen.getAllByRole('link');
  expect(info.textContent).toEqual(INFO_EMAIL);
  expect(info).toHaveAttribute('href', `mailto: ${INFO_EMAIL}`);
  expect(privacy.textContent).toEqual('privacy');
  expect(privacy).toHaveAttribute('href', ROUTE_PRIVACY.slice(0, -1));
  expect(terms.textContent).toEqual('terms');
  expect(terms).toHaveAttribute('href', ROUTE_TERMS.slice(0, -1));
  expect(facebook.textContent).toEqual('facebook');
  expect(facebook).toHaveAttribute('href', FB_URL);
  expect(instagram.textContent).toEqual('instagram');
  expect(instagram).toHaveAttribute('href', IG_URL);
});
