import React from 'react';
import { render, renderWithUser, screen } from 'testUtils';
import { MOCK_TEXT, MOCK_TITLE } from 'unitTests/sharedMocks';
import Tabs from './tabs';

const SECOND_TAB_HEADER = 'tab2';
const SECOND_TAB_CONTENT = 'content2';

const MOCK_TABS = [
  { header: MOCK_TITLE, content: MOCK_TEXT },
  { header: SECOND_TAB_HEADER, content: SECOND_TAB_CONTENT },
];

test('Tabs returns null when tabs are empty', () => {
  const { container } = render(<Tabs tabs={[]} />);
  expect(container).toBeEmptyDOMElement();
});

test('Tabs renders correctly', () => {
  render(<Tabs tabs={MOCK_TABS} />);
  const [tab1, tab2] = screen.getAllByRole('button');
  const tabContent1 = screen.getByText(MOCK_TEXT);
  const tabContent2 = screen.queryByText(SECOND_TAB_CONTENT);
  expect(tab1).toHaveTextContent(MOCK_TITLE);
  expect(tab1).toHaveClass('active');
  expect(tab2).toHaveTextContent(SECOND_TAB_HEADER);
  expect(tab2).not.toHaveClass('active');
  expect(tabContent1).toBeVisible();
  expect(tabContent2).not.toBeInTheDocument();
});

test('Tabs renders tabs number of items indicator correctly', () => {
  const secondTabNumberOfItems = 2;
  render(
    <Tabs
      tabs={[
        MOCK_TABS[0],
        { ...MOCK_TABS[1], numberOfItems: secondTabNumberOfItems },
      ]}
    />,
  );
  const [tab1, tab2] = screen.getAllByRole('button');
  expect(tab1.textContent).toBe(MOCK_TITLE);
  expect(tab2.textContent).toBe(
    `${SECOND_TAB_HEADER}${secondTabNumberOfItems}`,
  );
});

test('Clicking tabs renders correct content', async () => {
  const { user } = renderWithUser(<Tabs tabs={MOCK_TABS} />);
  const [tab1, tab2] = screen.getAllByRole('button');
  const tabContent1 = screen.getByText(MOCK_TEXT);
  const tabContent2 = screen.queryByText(SECOND_TAB_CONTENT);
  // initial render
  expect(tab1).toHaveClass('active');
  expect(tab2).not.toHaveClass('active');
  expect(tabContent1).toBeVisible();
  expect(tabContent2).not.toBeInTheDocument();
  // click on tab2
  await user.click(tab2);
  expect(tab1).not.toHaveClass('active');
  expect(tab2).toHaveClass('active');
  expect(tabContent1).toBeVisible();
  expect(tabContent2).not.toBeInTheDocument();
  //click on tab1
  await user.click(tab1);
  expect(tab1).toHaveClass('active');
  expect(tab2).not.toHaveClass('active');
  expect(tabContent1).toBeVisible();
  expect(tabContent2).not.toBeInTheDocument();
});
