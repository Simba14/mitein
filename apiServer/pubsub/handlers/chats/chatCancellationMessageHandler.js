import config from '@api/config';
import sendChatCancellationEmail from '@api/pubsub/drivers/sendChatEmail';
import { GERMAN } from '@api/firebase/constants/';

import { formatChatDate, formatChatTime } from 'helpers/index';
import { ROUTE_PROFILE } from 'routes';
import { DEFAULT_TIMEZONE } from '@api/firebase/constants';

const ChatCancellationMessageHandler = ({
  sendCancellationEmail = sendChatCancellationEmail,
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
    ? template.de.chatCancellation
    : template.en.chatCancellation;

  const date = formatChatDate(start, displayLanguage);
  const time = formatChatTime({
    start,
    end,
    language: displayLanguage,
    timezone: DEFAULT_TIMEZONE,
  });

  return sendCancellationEmail({
    emails: [{ email }],
    params: {
      date,
      time,
      link,
    },
    templateId,
  });
};

export default ChatCancellationMessageHandler;
