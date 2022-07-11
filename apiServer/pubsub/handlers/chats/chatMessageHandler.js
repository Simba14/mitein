import { log } from '@api/logger';
import ChatBookedMessageHandler from './chatBookedMessageHandler';
import ChatRequestedMessageHandler from './chatBookedMessageHandler';

import {
  CHAT_BOOKED_MESSAGE_TYPE,
  CHAT_REQUESTED_MESSAGE_TYPE,
} from '@api/pubsub';

const ChatsMessageHandler = async message => {
  switch (message.type) {
    case CHAT_BOOKED_MESSAGE_TYPE:
      await ChatBookedMessageHandler({ message });
      break;
    case CHAT_REQUESTED_MESSAGE_TYPE:
      await ChatRequestedMessageHandler({ message });
      break;
    default:
      log(
        `[Chats Message handler] Message type doesn't qualify to be handled, type: ${message.type}`,
        'debug',
      );
  }
};

export default ChatsMessageHandler;
