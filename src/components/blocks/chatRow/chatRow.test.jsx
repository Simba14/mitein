import React from 'react';
import { render, screen } from 'testUtils';
import ChatRow from './chatRow';
import {
  MOCK_CHAT,
  MOCK_START_SHORT,
  MOCK_TIME_EN,
} from 'unitTests/sharedMocks';
import { USER_TYPE_LEARNER, USER_TYPE_NATIVE } from '@api/firebase/constants';
import { ROUTE_CHATS_REBOOK } from 'routes';

test('ChatRow renders correctly when user is learner', () => {
  const { container } = render(
    <ChatRow chat={MOCK_CHAT} userType={USER_TYPE_LEARNER} />,
  );

  const link = screen.getByRole('link');
  expect(container).toHaveTextContent('title');
  expect(container).toHaveTextContent(MOCK_START_SHORT);
  expect(container).toHaveTextContent(MOCK_TIME_EN);
  expect(link).toHaveTextContent('cta');
  expect(link).toHaveAttribute(
    'href',
    `${ROUTE_CHATS_REBOOK}/${MOCK_CHAT.participant1Id}`,
  );
});

test('ChatRow renders correctly when user is native', () => {
  const { container } = render(
    <ChatRow chat={MOCK_CHAT} userType={USER_TYPE_NATIVE} />,
  );

  const link = screen.queryByRole('link');
  expect(container).toHaveTextContent('title');
  expect(container).toHaveTextContent(MOCK_START_SHORT);
  expect(container).toHaveTextContent(MOCK_TIME_EN);
  expect(link).not.toBeInTheDocument();
});
