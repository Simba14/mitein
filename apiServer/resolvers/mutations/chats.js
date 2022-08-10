import { v4 as uuidv4 } from 'uuid';
import Availability from '@api/firebase/availability';
import Chat from '@api/firebase/chat';
import User from '@api/firebase/user';
import {
  EVENT_DURATION,
  CHAT_STATUS_BOOKED,
  CHAT_STATUS_REQUESTED,
  CHAT_STATUS_AVAILABLE,
  CHAT_STATUS_REJECTED,
  CHAT_STATUS_CANCELLED,
} from '@api/firebase/constants';
import {
  FirebaseUpdateChatError,
  GENERIC_ERROR_MESSAGE,
  CHAT_CANCELLED_MESSAGE,
  CHAT_UNAVAILABLE_MESSAGE,
} from '@api/firebase/errors';

import chatCancellationMessageHandler from '@api/pubsub/handlers/chats/chatCancellationMessageHandler';

const createChats = async ({
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
      },
    });

    chats.push(chat);
  }

  return chats;
};

// guard against HTTP 409 conflicts
const isInvalidChatUpdate = async ({ id, status }) => {
  const existingChat = await Chat.byId(id);
  const isAvailable = existingChat?.status === CHAT_STATUS_AVAILABLE;
  const isCancelled = existingChat?.status === CHAT_STATUS_CANCELLED;
  const isRequested = existingChat?.status === CHAT_STATUS_REQUESTED;

  // when LEARNER tries to cancel an already confirmed/rejected request
  if (status === CHAT_STATUS_AVAILABLE && !isRequested)
    throw new FirebaseUpdateChatError(GENERIC_ERROR_MESSAGE);

  // when chat requested is no longer available
  if (status === CHAT_STATUS_REQUESTED && !isAvailable) {
    throw new FirebaseUpdateChatError(CHAT_UNAVAILABLE_MESSAGE);
  }

  // trying to confirm an already cancelled request
  if (status === CHAT_STATUS_BOOKED && !isRequested) {
    const errorMessage =
      existingChat?.status === CHAT_STATUS_AVAILABLE
        ? CHAT_CANCELLED_MESSAGE
        : GENERIC_ERROR_MESSAGE;
    throw new FirebaseUpdateChatError(errorMessage);
  }

  // trying to reject an already cancelled request
  if (status === CHAT_STATUS_REJECTED && isAvailable)
    throw new FirebaseUpdateChatError(CHAT_CANCELLED_MESSAGE);

  // trying to cancel an already cancelled chat
  if (status === CHAT_STATUS_CANCELLED && isCancelled)
    throw new FirebaseUpdateChatError(CHAT_CANCELLED_MESSAGE);
};

const ChatsMutation = {
  createChatsFromAvailability: async (
    parent,
    { participant1Id, participant2Id, status, start, end, userType },
  ) => {
    const id = uuidv4();
    const availability = await Availability.create({
      id,
      fields: {
        id,
        start,
        end,
        userId: participant1Id,
        userType,
      },
    });

    await createChats({
      availabilityId: availability.id,
      participant1Id,
      participant2Id,
      status,
      start,
      end,
    });

    return availability;
  },
  deleteChats: async (parent, { ids }) => {
    const deleteActions = ids.map(
      id =>
        new Promise(async (res, rej) => {
          try {
            await Chat.deleteByAvailabilityId(id);
            await Availability.deleteById(id);
            res();
          } catch (error) {
            rej(error);
          }
        }),
    );

    return Promise.all(deleteActions).then(() => true);
  },
  updateChat: async (parent, { id, ...fields }) => {
    const {
      cancellationReason,
      cancelledBy,
      participant1Id,
      participant2Id,
      status,
    } = fields;

    await isInvalidChatUpdate({
      id,
      status,
      participant2Id,
    });

    if (id) {
      if (status === CHAT_STATUS_BOOKED) {
        const bookedChat = await Chat.book({
          id,
          fields,
        });

        return bookedChat;
      }

      if (status === CHAT_STATUS_REQUESTED) {
        const requestedChat = await Chat.request({
          id,
          fields,
        });

        return requestedChat;
      }

      const chat = await Chat.updateById({
        id,
        fields: {
          ...fields,
        },
      });

      if (cancellationReason && cancelledBy) {
        const cancelledOnUserId =
          cancelledBy !== participant1Id ? participant1Id : participant2Id;
        const cancelledOnUser = await User.byId(cancelledOnUserId);

        chatCancellationMessageHandler({
          message: {
            participant: cancelledOnUser,
            chat,
          },
        });

        await User.updateCancellations({
          chatId: id,
          userId: cancelledBy,
        });
      }

      return chat;
    } else {
      const newId = uuidv4();
      return Chat.create({
        id: newId,
        chat: {
          id: newId,
          ...fields,
        },
      });
    }
  },
};

export default ChatsMutation;
