import { log } from '@api/logger';
import SessionBookedMessageHandler from './sessionBookedMessageHandler';

import { SESSION_BOOKED_MESSAGE_TYPE } from '@api/pubsub';

const SessionsMessageHandler = async message => {
  switch (message.type) {
    case SESSION_BOOKED_MESSAGE_TYPE:
      await SessionBookedMessageHandler({ message });
      break;
    default:
      log(
        `[Sessions Message handler] Message type doesn't qualify to be handled, type: ${message.type}`,
        'debug',
      );
  }
};

export default SessionsMessageHandler;
