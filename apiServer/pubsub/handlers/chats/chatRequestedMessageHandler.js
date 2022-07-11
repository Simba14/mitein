import config from '@api/config';
import sendChatRequestedEmail from '@api/pubsub/drivers/sendChatEmail';
import { GERMAN } from '@api/firebase/constants/';

import { formatChatDate, formatChatTime } from 'helpers/index';
import { ROUTE_PROFILE } from 'routes';

const ChatRequestedMessageHandler = ({
  sendRequestedEmail = sendChatRequestedEmail,
  message,
}) => {
  const {
    participant: { displayLanguage, email },
    chat: { start, end },
  } = message;

  const {
    sendinblue: { template },
    uiHost,
  } = config;

  const langIsGerman = displayLanguage === GERMAN;
  const localePath = langIsGerman ? `/${GERMAN}` : '';
  const link = `${uiHost}${localePath}${ROUTE_PROFILE}`;

  const templateId = langIsGerman
    ? template.de.chatRequest
    : template.en.chatRequest;

  const date = formatChatDate(start, displayLanguage);
  const time = formatChatTime({ start, end, language: displayLanguage });

  return sendRequestedEmail({
    emails: [{ email }],
    params: {
      date,
      time,
      link,
    },
    templateId,
  });
};

export default ChatRequestedMessageHandler;
