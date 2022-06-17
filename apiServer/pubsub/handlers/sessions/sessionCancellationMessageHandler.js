import config from '@api/config';
import sendSessionCancellationEmail from '@api/pubsub/drivers/sendSessionEmail';
import { GERMAN } from '@api/firebase/constants/';

import { formatSessionDate, formatSessionTime } from 'helpers/index';
import { ROUTE_PROFILE } from 'routes';

const SessionCancellationMessageHandler = ({
  sendCancellationEmail = sendSessionCancellationEmail,
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
    ? template.de.sessionCancellation
    : template.en.sessionCancellation;

  const date = formatSessionDate(start, displayLanguage);
  const time = formatSessionTime({ start, end, language: displayLanguage });

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

export default SessionCancellationMessageHandler;
