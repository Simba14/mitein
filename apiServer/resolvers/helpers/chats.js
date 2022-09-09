import { isEmpty } from 'lodash/fp';
import { v4 as uuidv4 } from 'uuid';
import Chat from '@api/firebase/chat';
import {
  CHAT_STATUS_AVAILABLE,
  CHAT_STATUS_BOOKED,
  CHAT_STATUS_CANCELLED,
  CHAT_STATUS_REQUESTED,
  CHAT_STATUS_REJECTED,
  CHAT_TYPE_VIDEO,
  EVENT_DURATION,
} from '@api/firebase/constants';
import {
  FirebaseUpdateChatError,
  GENERIC_ERROR_MESSAGE,
  CHAT_CANCELLED_MESSAGE,
  CHAT_UNAVAILABLE_MESSAGE,
} from '@api/firebase/errors';

// guard against HTTP 409 conflicts
export const isInvalidChatUpdate = async ({ chat, newStatus }) => {
  const isAvailable = chat?.status === CHAT_STATUS_AVAILABLE;
  const isCancelled = chat?.status === CHAT_STATUS_CANCELLED;
  const isRequested = chat?.status === CHAT_STATUS_REQUESTED;

  // when LEARNER tries to cancel an already confirmed/rejected request
  if (newStatus === CHAT_STATUS_AVAILABLE && !isRequested)
    throw new FirebaseUpdateChatError(GENERIC_ERROR_MESSAGE);

  // when chat requested is no longer available
  if (newStatus === CHAT_STATUS_REQUESTED && !isAvailable) {
    throw new FirebaseUpdateChatError(CHAT_UNAVAILABLE_MESSAGE);
  }

  // trying to confirm an already cancelled request
  if (newStatus === CHAT_STATUS_BOOKED && !isRequested) {
    const errorMessage =
      chat?.newStatus === CHAT_STATUS_AVAILABLE
        ? CHAT_CANCELLED_MESSAGE
        : GENERIC_ERROR_MESSAGE;
    throw new FirebaseUpdateChatError(errorMessage);
  }

  // trying to reject an already cancelled request
  if (newStatus === CHAT_STATUS_REJECTED && isAvailable)
    throw new FirebaseUpdateChatError(CHAT_CANCELLED_MESSAGE);

  // trying to cancel an already cancelled chat
  if (newStatus === CHAT_STATUS_CANCELLED && isCancelled)
    throw new FirebaseUpdateChatError(CHAT_CANCELLED_MESSAGE);
};

export const createChats = async ({
  availabilityId,
  start,
  end,
  participant1Id,
  participant2Id,
  status,
}) => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const numberOfChats = (endDate - startDate) / EVENT_DURATION;
  const chats = [];

  for (let i = 0; i < numberOfChats; i++) {
    const id = uuidv4();
    const chat = await Chat.create({
      id,
      chat: {
        id,
        availabilityId,
        participant1Id,
        participant2Id: participant2Id || null,
        status,
        start: new Date(startDate.getTime() + i * EVENT_DURATION).toISOString(),
        end: new Date(
          startDate.getTime() + (i + 1) * EVENT_DURATION,
        ).toISOString(),
        cancellationReason: null,
        type: CHAT_TYPE_VIDEO,
      },
    });

    chats.push(chat);
  }

  return chats;
};

export const groupChatsByStatus = chats => {
  if (!chats)
    return {
      booked: null,
      cancelled: null,
      past: null,
      requested: null,
      rejected: null,
    };

  const dateConstraint = new Date();
  dateConstraint.setTime(dateConstraint.getTime() - 60 * 60 * 1000); // set 1 hour into past

  const [booked, cancelled, past, requested, rejected] = chats.reduce(
    ([bookings, cancellations, past, requests, rejections], chat) => {
      const isBooked = chat.status === CHAT_STATUS_BOOKED;
      // valid past chats are only those that are BOOKED
      if (chat.start < dateConstraint.toISOString())
        return [
          bookings,
          cancellations,
          isBooked ? [...past, chat] : past,
          requests,
          rejections,
        ];
      if (isBooked)
        return [[...bookings, chat], cancellations, past, requests, rejections];
      if (chat.status === CHAT_STATUS_CANCELLED)
        return [bookings, [...cancellations, chat], past, requests, rejections];
      if (chat.status === CHAT_STATUS_REQUESTED)
        return [bookings, cancellations, past, [...requests, chat], rejections];
      if (chat.status === CHAT_STATUS_REJECTED)
        return [bookings, cancellations, past, requests, [...rejections, chat]];

      return [bookings, cancellations, past, requests, rejections];
    },
    [[], [], [], [], []],
  );

  return {
    booked: isEmpty(booked) ? null : booked,
    cancelled: isEmpty(cancelled) ? null : cancelled,
    past: isEmpty(past) ? null : past,
    requested: isEmpty(requested) ? null : requested,
    rejected: isEmpty(rejected) ? null : rejected,
  };
};
