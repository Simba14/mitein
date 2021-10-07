import config from '@api/config';
import Pubsub, { SESSION_BOOKED_MESSAGE_TYPE } from '@api/pubsub';

const pubsub = Pubsub();

const publishSessionBookedMessage = ({ id, participant, session }) => {
  const message = {
    id,
    session,
    participant,
    type: SESSION_BOOKED_MESSAGE_TYPE,
  };

  return pubsub.publishMessage({
    message,
    topic: config.gcp.topics.sessions,
  });
};

export default publishSessionBookedMessage;
