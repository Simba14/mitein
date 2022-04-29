import React from 'react';
import { render, screen } from 'testUtils';
import OrgnanizationCard from './organizationCard';
import { mockT, MOCK_URL } from 'unitTests/sharedMocks';
import { FB } from 'components/svg';

const mockOrganization = {
  name: 'Mitein',
  description: 'it be nice',
  city: 'Berlin',
  logo: 'logo-url',
  website: MOCK_URL,
  socials: { [FB]: 'facebook.com' },
  tags: ['online', 'paid'],
};

test('OrgnanizationCard renders correctly when loading', () => {
  render(<OrgnanizationCard t={mockT} loading />);

  const [card, ...tags] = screen.getAllByRole('listitem');
  const logo = screen.getByRole('img');
  const header = screen.getByRole('heading', { level: 4 });
  const tagsList = screen.getByRole('list');
  const links = screen.queryAllByRole('link');
  expect(card).toBeInTheDocument();
  expect(card.firstChild).toHaveClass('loading');
  expect(logo).toBeInTheDocument();
  expect(logo).toHaveAccessibleName('logo - loading');
  expect(header).toHaveTextContent('');
  expect(card).not.toHaveTextContent(mockOrganization.description);
  expect(tagsList).not.toContain(tags);
  expect(links.length).toEqual(0);
});

test('OrgnanizationCard renders correctly when organization loaded', () => {
  render(<OrgnanizationCard t={mockT} organization={mockOrganization} />);

  const [card, tag1, tag2, tag3] = screen.getAllByRole('listitem');
  const logo = screen.getByRole('img');
  const header = screen.getByRole('heading', { level: 4 });
  const tagsList = screen.getByRole('list');
  const [facebook, website] = screen.queryAllByRole('link');

  expect(card).toBeInTheDocument();
  expect(card.firstChild).not.toHaveClass('loading');
  expect(logo).toBeInTheDocument();
  expect(logo).toHaveAccessibleName(`logo - ${mockOrganization.name}`);
  expect(header).toHaveTextContent('Mitein');
  expect(card).toHaveTextContent(mockOrganization.description);
  expect(tagsList).toContainElement(tag1);
  expect(tagsList).toContainElement(tag2);
  expect(tagsList).toContainElement(tag3);
  expect(tag1).toHaveTextContent(mockOrganization.city);
  expect(tag2).toHaveTextContent(mockOrganization.tags[0]);
  expect(tag3).toHaveTextContent(mockOrganization.tags[1]);
  expect(facebook).toHaveAttribute('href', mockOrganization.socials[FB]);
  expect(facebook).toHaveAccessibleName(FB);
  expect(website).toHaveAttribute('href', MOCK_URL);
  expect(website).toHaveTextContent('learnMore');
});
