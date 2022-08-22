import config from '@api/config';
import sendChatConfirmationEmail from '@api/pubsub/drivers/sendChatEmail';
import { DEFAULT_TIMEZONE, ENGLISH } from '@api/firebase/constants/';

import { formatChatDate, formatChatTime } from 'helpers/index';

const ChatBookedMessageHandler = ({
  sendConfirmationEmail = sendChatConfirmationEmail,
  message,
}) => {
  const {
    participant: { displayLanguage, email },
    chat: { start, end, link },
    topics,
    otherParticipant,
  } = message;

  const {
    sendinblue: { template },
  } = config;

  const templateId =
    displayLanguage === ENGLISH
      ? template.en.chatConfirmation
      : template.de.chatConfirmation;

  const date = formatChatDate(start, displayLanguage);
  const time = formatChatTime({
    start,
    end,
    language: displayLanguage,
    timeZone: DEFAULT_TIMEZONE,
  });

  return sendConfirmationEmail({
    emails: [{ email }],
    params: {
      date,
      link,
      time,
      topics,
      otherParticipant,
    },
    templateId,
  });
};

export default ChatBookedMessageHandler;
