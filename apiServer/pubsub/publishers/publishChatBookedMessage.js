import config from '@api/config';
import Pubsub, { CHAT_BOOKED_MESSAGE_TYPE } from '@api/pubsub';

const pubsub = Pubsub();

const publishChatBookedMessage = ({ id, participant, chat }) => {
  const message = {
    id,
    chat,
    participant,
    type: CHAT_BOOKED_MESSAGE_TYPE,
  };

  return pubsub.publishMessage({
    message,
    topic: config.gcp.topics.chats,
  });
};

export default publishChatBookedMessage;
