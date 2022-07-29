import React from 'react';
import { render, screen } from 'testUtils';
import ContentSection from './contentSection';
import { MOCK_TEXT, MOCK_TITLE } from 'unitTests/sharedMocks';

const CHILDREN_TEST_ID = 'children';

test('ContentSection renders correctly when only children provided', () => {
  render(
    <ContentSection>
      <div data-testid={CHILDREN_TEST_ID} />
    </ContentSection>,
  );

  const title = screen.queryByRole('heading');
  const content = screen.queryByText(MOCK_TEXT);
  const children = screen.getByTestId(CHILDREN_TEST_ID);
  expect(children).toBeInTheDocument();
  expect(title).not.toBeInTheDocument();
  expect(content).not.toBeInTheDocument();
});

test('ContentSection renders correctly when children, content and title provided', () => {
  render(
    <ContentSection content={MOCK_TEXT} title={MOCK_TITLE}>
      <div data-testid={CHILDREN_TEST_ID} />
    </ContentSection>,
  );

  const title = screen.getByRole('heading');
  const content = screen.getByText(MOCK_TEXT);
  const children = screen.getByTestId(CHILDREN_TEST_ID);
  expect(children).toBeInTheDocument();
  expect(title).toBeInTheDocument();
  expect(content).toBeInTheDocument();
});

test('ContentSection renders only title', () => {
  render(<ContentSection title={MOCK_TITLE} />);

  const title = screen.getByRole('heading');
  const content = screen.queryByText(MOCK_TEXT);
  const children = screen.queryByTestId(CHILDREN_TEST_ID);
  expect(children).not.toBeInTheDocument();
  expect(title).toBeInTheDocument();
  expect(content).not.toBeInTheDocument();
});

test('ContentSection renders only content', () => {
  render(<ContentSection content={MOCK_TEXT} />);

  const title = screen.queryByRole('heading');
  const content = screen.getByText(MOCK_TEXT);
  const children = screen.queryByTestId(CHILDREN_TEST_ID);
  expect(children).not.toBeInTheDocument();
  expect(title).not.toBeInTheDocument();
  expect(content).toBeInTheDocument();
});
