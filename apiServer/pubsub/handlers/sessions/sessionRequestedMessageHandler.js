import config from '@api/config';
import sendSessionRequestedEmail from '@api/pubsub/drivers/sendSessionEmail';
import { GERMAN } from '@api/firebase/constants/';

import { formatSessionDate, formatSessionTime } from 'helpers/index';
import { ROUTE_PROFILE } from 'routes';

const SessionRequestedMessageHandler = ({
  sendRequestedEmail = sendSessionRequestedEmail,
  message,
}) => {
  const {
    participant: { displayLanguage, email },
    session: { start, end },
  } = message;

  const {
    sendinblue: { template },
    uiHost,
  } = config;

  const langIsGerman = displayLanguage === GERMAN;
  const localePath = langIsGerman ? `/${GERMAN}` : '';
  const link = `${uiHost}${localePath}${ROUTE_PROFILE}/`;
  const templateId = langIsGerman
    ? template.de.sessionRequest
    : template.en.sessionRequest;

  const date = formatSessionDate(start, displayLanguage);
  const time = formatSessionTime({ start, end, language: displayLanguage });

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

export default SessionRequestedMessageHandler;
