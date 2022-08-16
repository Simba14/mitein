import {
  CHAT_STATUS_BOOKED,
  CHAT_STATUS_REQUESTED,
} from '@api/firebase/constants';
import React from 'react';
import { render, screen } from 'testUtils';
import { MOCK_CHAT, MOCK_ID } from 'unitTests/sharedMocks';
import { USER_TYPE_LEARNER } from '@api/firebase/constants';
import ChatsSection from './ChatsSection';

test('ChatsSection renders upcoming, requested, and past tabs', () => {
  render(
    <ChatsSection
      userId={MOCK_ID}
      userType={USER_TYPE_LEARNER}
      upcomingChats={[{ ...MOCK_CHAT, status: CHAT_STATUS_BOOKED }]}
      pastChats={[{ ...MOCK_CHAT, status: CHAT_STATUS_BOOKED }]}
      requestedChats={[{ ...MOCK_CHAT, status: CHAT_STATUS_REQUESTED }]}
    />,
  );

  const [upcomingTab, requestedTab, pastTab] = screen.getAllByRole('button');

  expect(upcomingTab).toHaveTextContent('upcoming');
  expect(requestedTab).toHaveTextContent('requested');
  expect(pastTab).toHaveTextContent('past');
});

test('ChatsSection renders upcoming chats tab only', () => {
  render(
    <ChatsSection
      userId={MOCK_ID}
      userType={USER_TYPE_LEARNER}
      upcomingChats={[{ ...MOCK_CHAT, status: CHAT_STATUS_BOOKED }]}
    />,
  );

  const upcomingTab = screen.getByRole('button', { name: 'upcoming 1' });
  expect(upcomingTab).toHaveTextContent('upcoming');
  const requestedTab = screen.queryByText('requested');
  const pastTab = screen.queryByText('past');
  expect(requestedTab).not.toBeInTheDocument();
  expect(pastTab).not.toBeInTheDocument();
});

test('ChatsSection renders requested tab only', () => {
  render(
    <ChatsSection
      userId={MOCK_ID}
      userType={USER_TYPE_LEARNER}
      requestedChats={[{ ...MOCK_CHAT, status: CHAT_STATUS_REQUESTED }]}
    />,
  );

  const requestedTab = screen.getByRole('button', { name: 'requested 1' });
  expect(requestedTab).toHaveTextContent('requested');
  const upcomingTab = screen.queryByText('upcoming');
  const pastTab = screen.queryByText('past');
  expect(upcomingTab).not.toBeInTheDocument();
  expect(pastTab).not.toBeInTheDocument();
});

test('ChatsSection renders past tab only', () => {
  render(
    <ChatsSection
      userId={MOCK_ID}
      userType={USER_TYPE_LEARNER}
      pastChats={[{ ...MOCK_CHAT, status: CHAT_STATUS_BOOKED }]}
    />,
  );

  const pastTab = screen.getByRole('button', { name: 'past 1' });
  expect(pastTab).toHaveTextContent('past');
  const upcomingTab = screen.queryByText('upcoming');
  const requestedTab = screen.queryByText('requested');
  expect(upcomingTab).not.toBeInTheDocument();
  expect(requestedTab).not.toBeInTheDocument();
});
