import React from 'react';
import { render, screen } from 'testUtils';
import Footer, { FB_URL, IG_URL, INFO_EMAIL } from './footer';

test('Footer renders correctly', () => {
  render(<Footer />);
  const footer = screen.getByRole('contentinfo');
  expect(footer).toBeInTheDocument();
  expect(footer).toHaveTextContent('Mitein 2021');

  const cookieBtn = screen.getByRole('button');
  expect(cookieBtn).toHaveTextContent('Cookie Settings');

  // links
  const [info, facebook, instagram] = screen.getAllByRole('link');
  expect(info.textContent).toEqual(INFO_EMAIL);
  expect(info).toHaveAttribute('href', `mailto: ${INFO_EMAIL}`);
  expect(facebook.textContent).toEqual('facebook');
  expect(facebook).toHaveAttribute('href', FB_URL);
  expect(instagram.textContent).toEqual('instagram');
  expect(instagram).toHaveAttribute('href', IG_URL);
});
