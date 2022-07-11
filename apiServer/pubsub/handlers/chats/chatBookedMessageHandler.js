import config from '@api/config';
import sendChatConfirmationEmail from '@api/pubsub/drivers/sendChatEmail';
import { ENGLISH } from '@api/firebase/constants/';

import { formatChatDate, formatChatTime } from 'helpers/index';

const ChatBookedMessageHandler = ({
  sendConfirmationEmail = sendChatConfirmationEmail,
  message,
}) => {
  const {
    participant: { displayLanguage, email },
    chat: { start, end, link },
    topics,
  } = message;

  const {
    sendinblue: { template },
  } = config;

  const templateId =
    displayLanguage === ENGLISH
      ? template.en.chatConfirmation
      : template.de.chatConfirmation;

  const date = formatChatDate(start, displayLanguage);
  const time = formatChatTime({ start, end, language: displayLanguage });

  return sendConfirmationEmail({
    emails: [{ email }],
    params: {
      date,
      link,
      time,
      topics,
    },
    templateId,
  });
};

export default ChatBookedMessageHandler;
