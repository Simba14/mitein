import { get } from 'lodash/fp';
import { v4 as uuidv4 } from 'uuid';
import Availability from '@api/firebase/availability';
import Chat from '@api/firebase/chat';
import User from '@api/firebase/user';
import {
  EVENT_DURATION,
  CHAT_STATUS_BOOKED,
  CHAT_STATUS_REQUESTED,
} from '@api/firebase/constants';
import chatCancellationMessageHandler from '@api/pubsub/handlers/Chats/chatCancellationMessageHandler';

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

    if (id) {
      if (status === CHAT_STATUS_BOOKED) {
        const bookedchat = await Chat.book({
          id,
          fields,
        });

        return bookedchat;
      }

      if (status === CHAT_STATUS_REQUESTED) {
        const existingchat = await Chat.byId(id);
        const existingParticipant2 = get('participant2Id', existingchat);

        if (existingParticipant2 && existingParticipant2 !== participant2Id)
          throw new Error('chat no longer available. Please try again.');

        const requestedchat = await Chat.request({
          id,
          fields,
        });

        return requestedchat;
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