import config from '@api/config';
import Pubsub, { SESSION_REQUESTED_MESSAGE_TYPE } from '@api/pubsub';

const pubsub = Pubsub();

const publishSessionRequestedMessage = ({ participant, session }) => {
  const message = {
    session,
    participant,
    type: SESSION_REQUESTED_MESSAGE_TYPE,
  };

  return pubsub.publishMessage({
    message,
    topic: config.gcp.topics.sessions,
  });
};

export default publishSessionRequestedMessage;
