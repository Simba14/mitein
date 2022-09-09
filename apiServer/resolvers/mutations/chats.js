import { v4 as uuidv4 } from 'uuid';
import Availability from '@api/firebase/availability';
import Chat from '@api/firebase/chat';
import User from '@api/firebase/user';
import {
  CHAT_STATUS_BOOKED,
  CHAT_STATUS_REQUESTED,
  CHAT_TYPE_VIDEO,
} from '@api/firebase/constants';
import { createChats, isInvalidChatUpdate } from '@api/resolvers/helpers/chats';

import chatCancellationMessageHandler from '@api/pubsub/handlers/chats/chatCancellationMessageHandler';

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

    const existingChat = await Chat.byId(id);
    isInvalidChatUpdate({
      chat: existingChat,
      newStatus: status,
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
          type: CHAT_TYPE_VIDEO,
          ...fields,
        },
      });
    }
  },
};

export default ChatsMutation;
