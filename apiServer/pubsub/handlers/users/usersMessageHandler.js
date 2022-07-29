import { log } from '@api/logger';
import UserCreatedMessageHandler from './userCreatedMessageHandler';

import { USER_CREATED_MESSAGE_TYPE } from '@api/pubsub';

const UsersMessageHandler = async message => {
  switch (message.type) {
    case USER_CREATED_MESSAGE_TYPE:
      await UserCreatedMessageHandler({ message });
      break;
    default:
      log(
        `[Users Message handler] Message type doesn't qualify to be handled, type: ${message.type}`,
        'debug',
      );
  }
};

export default UsersMessageHandler;
