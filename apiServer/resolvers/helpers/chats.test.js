import {
  CHAT_STATUS_CANCELLED,
  CHAT_STATUS_BOOKED,
  CHAT_STATUS_REJECTED,
  CHAT_STATUS_REQUESTED,
} from '@api/firebase/constants';
import { getMockChat } from 'unitTests/sharedMocks';
import { groupChatsByStatus } from './chats';

jest.mock('@api/firebase/chat', () => ({}));

const upcomingDate = new Date();
upcomingDate.setTime(upcomingDate.getTime() + 60 * 60 * 1000); // set 1 hour into future

const CANCELLED_CHAT = getMockChat({
  status: CHAT_STATUS_CANCELLED,
  start: upcomingDate,
});
const UPCOMING_BOOKED_CHAT = getMockChat({
  status: CHAT_STATUS_BOOKED,
  start: upcomingDate,
});
const PAST_BOOKED_CHAT = getMockChat({
  status: CHAT_STATUS_BOOKED,
});
const REJECTED_CHAT = getMockChat({
  status: CHAT_STATUS_REJECTED,
  start: upcomingDate,
});
const REQUESTED_CHAT = getMockChat({
  status: CHAT_STATUS_REQUESTED,
  start: upcomingDate,
});

const MOCK_CHATS = [
  CANCELLED_CHAT,
  REJECTED_CHAT,
  REQUESTED_CHAT,
  UPCOMING_BOOKED_CHAT,
  PAST_BOOKED_CHAT,
];

describe('groupChatsByStatus', () => {
  test('returns null for all statuses when chats is null', () => {
    const chats = groupChatsByStatus(null);
    expect(chats.booked).toBeNull();
    expect(chats.cancelled).toBeNull();
    expect(chats.past).toBeNull();
    expect(chats.requested).toBeNull();
    expect(chats.rejected).toBeNull();
  });

  test('return null for all statuses when chats is empty array', () => {
    const chats = groupChatsByStatus([]);
    expect(chats.booked).toBeNull();
    expect(chats.cancelled).toBeNull();
    expect(chats.past).toBeNull();
    expect(chats.requested).toBeNull();
    expect(chats.rejected).toBeNull();
  });

  test('returns chats correctly grouped by their status', () => {
    const chats = groupChatsByStatus(MOCK_CHATS);
    expect(chats.booked).toEqual([UPCOMING_BOOKED_CHAT]);
    expect(chats.cancelled).toEqual([CANCELLED_CHAT]);
    expect(chats.past).toEqual([PAST_BOOKED_CHAT]);
    expect(chats.requested).toEqual([REQUESTED_CHAT]);
    expect(chats.rejected).toEqual([REJECTED_CHAT]);
  });

  test('does not return chats in the past that are not BOOKED', () => {
    const PAST_CANCELLED_CHAT = getMockChat({ status: CHAT_STATUS_CANCELLED });
    const PAST_REJECTED_CHAT = getMockChat({ status: CHAT_STATUS_REJECTED });
    const PAST_REQUESTED_CHAT = getMockChat({ status: CHAT_STATUS_REQUESTED });
    const chats = groupChatsByStatus([
      PAST_BOOKED_CHAT,
      PAST_CANCELLED_CHAT,
      PAST_REJECTED_CHAT,
      PAST_REQUESTED_CHAT,
    ]);

    expect(chats.booked).toBeNull();
    expect(chats.cancelled).toBeNull();
    expect(chats.past).toEqual([PAST_BOOKED_CHAT]);
    expect(chats.requested).toBeNull();
    expect(chats.rejected).toBeNull();
  });
});
