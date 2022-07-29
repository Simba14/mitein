import config from '@api/config';
import Pubsub, { CHAT_REQUESTED_MESSAGE_TYPE } from '@api/pubsub';

const pubsub = Pubsub();

const publishChatRequestedMessage = ({ participant, chat }) => {
  const message = {
    chat,
    participant,
    type: CHAT_REQUESTED_MESSAGE_TYPE,
  };

  return pubsub.publishMessage({
    message,
    topic: config.gcp.topics.chats,
  });
};

export default publishChatRequestedMessage;
