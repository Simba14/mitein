import {
  CHAT_STATUS_BOOKED,
  CHAT_STATUS_REQUESTED,
} from '@api/firebase/constants';
import React from 'react';
import { render, screen } from 'testUtils';
import { getMockChat, MOCK_ID } from 'unitTests/sharedMocks';
import { USER_TYPE_LEARNER } from '@api/firebase/constants';
import ChatsSection from './ChatsSection';

const UPCOMING_CHATS_MOCK = [getMockChat({ status: CHAT_STATUS_BOOKED })];
const PAST_CHATS_MOCK = [getMockChat({ status: CHAT_STATUS_BOOKED })];
const REQUESTED_CHATS_MOCK = [getMockChat({ status: CHAT_STATUS_REQUESTED })];

test('ChatsSection renders upcoming, requested, and past tabs', () => {
  render(
    <ChatsSection
      userId={MOCK_ID}
      userType={USER_TYPE_LEARNER}
      upcomingChats={UPCOMING_CHATS_MOCK}
      pastChats={PAST_CHATS_MOCK}
      requestedChats={REQUESTED_CHATS_MOCK}
    />,
  );

  const [upcomingTab, requestedTab, pastTab] = screen.getAllByRole('button');

  expect(upcomingTab).toHaveTextContent('upcomingTab');
  expect(requestedTab).toHaveTextContent('requestedTab');
  expect(pastTab).toHaveTextContent('pastTab');
});

test('ChatsSection renders upcoming chats tab only', () => {
  render(
    <ChatsSection
      userId={MOCK_ID}
      userType={USER_TYPE_LEARNER}
      upcomingChats={UPCOMING_CHATS_MOCK}
    />,
  );

  const upcomingTab = screen.getByRole('button', { name: 'upcomingTab 1' });
  expect(upcomingTab).toHaveTextContent('upcomingTab');
  const requestedTab = screen.queryByText('requestedTab');
  const pastTab = screen.queryByText('pastTab');
  expect(requestedTab).not.toBeInTheDocument();
  expect(pastTab).not.toBeInTheDocument();
});

test('ChatsSection renders requested tab only', () => {
  render(
    <ChatsSection
      userId={MOCK_ID}
      userType={USER_TYPE_LEARNER}
      requestedChats={REQUESTED_CHATS_MOCK}
    />,
  );

  const requestedTab = screen.getByRole('button', { name: 'requestedTab 1' });
  expect(requestedTab).toHaveTextContent('requestedTab');
  const upcomingTab = screen.queryByText('upcomingTab');
  const pastTab = screen.queryByText('pastTab');
  expect(upcomingTab).not.toBeInTheDocument();
  expect(pastTab).not.toBeInTheDocument();
});

test('ChatsSection renders past tab only', () => {
  render(
    <ChatsSection
      userId={MOCK_ID}
      userType={USER_TYPE_LEARNER}
      pastChats={PAST_CHATS_MOCK}
    />,
  );

  const pastTab = screen.getByRole('button', { name: 'pastTab 1' });
  expect(pastTab).toHaveTextContent('pastTab');
  const upcomingTab = screen.queryByText('upcomingTab');
  const requestedTab = screen.queryByText('requestedTab');
  expect(upcomingTab).not.toBeInTheDocument();
  expect(requestedTab).not.toBeInTheDocument();
});
