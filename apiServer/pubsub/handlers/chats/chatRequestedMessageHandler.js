import config from '@api/config';
import sendChatRequestedEmail from '@api/pubsub/drivers/sendChatEmail';
import { DEFAULT_TIMEZONE, GERMAN } from '@api/firebase/constants/';

import { formatChatDate, formatChatTime } from 'helpers/index';
import { ROUTE_PROFILE } from 'routes';

const ChatRequestedMessageHandler = ({
  sendRequestedEmail = sendChatRequestedEmail,
  message,
}) => {
  const {
    participant: { displayLanguage, email },
    chat: { participant2Name, start, end },
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
  const time = formatChatTime({
    start,
    end,
    language: displayLanguage,
    timeZone: DEFAULT_TIMEZONE,
  });

  return sendRequestedEmail({
    emails: [{ email }],
    params: {
      date,
      requestedBy: participant2Name,
      time,
      link,
    },
    templateId,
  });
};

export default ChatRequestedMessageHandler;
