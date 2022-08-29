import React from 'react';
import { render, screen } from 'testUtils';
import ChatRow from './chatRow';
import { MOCK_CHAT, MOCK_START_EN, MOCK_TIME_EN } from 'unitTests/sharedMocks';
import { USER_TYPE_LEARNER } from '@api/firebase/constants';
import { ROUTE_CHATS_REBOOK } from 'routes';

test('ChatRow renders correctly', () => {
  const { container } = render(
    <ChatRow chat={MOCK_CHAT} userType={USER_TYPE_LEARNER} />,
  );

  const link = screen.getByRole('link');
  expect(container).toHaveTextContent('title');
  expect(container).toHaveTextContent(MOCK_START_EN);
  expect(container).toHaveTextContent(MOCK_TIME_EN);
  expect(link).toHaveTextContent('cta');
  expect(link).toHaveAttribute('href', ROUTE_CHATS_REBOOK);
});
