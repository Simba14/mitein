import config from '@api/config';
import Pubsub, { USER_CREATED_MESSAGE_TYPE } from '@api/pubsub';

const pubsub = Pubsub();

const publishUserCreatedMessage = user => {
  const message = { user, type: USER_CREATED_MESSAGE_TYPE };

  return pubsub.publishMessage({
    message,
    topic: config.gcp.topics.users,
  });
};

export default publishUserCreatedMessage;
