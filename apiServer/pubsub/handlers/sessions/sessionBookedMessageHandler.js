import config from '@api/config';
import sendSessionConfirmationEmail from '@api/pubsub/drivers/sendSessionEmail';
import { ENGLISH } from '@api/firebase/constants/';

import { formatSessionDate, formatSessionTime } from 'helpers/index';

const SessionBookedMessageHandler = ({
  sendConfirmationEmail = sendSessionConfirmationEmail,
  message,
}) => {
  const {
    participant: { displayLanguage, email },
    session: { start, end, link },
  } = message;

  const {
    sendinblue: { template },
  } = config;
  const templateId =
    displayLanguage === ENGLISH
      ? template.en.sessionConfirmation
      : template.de.sessionConfirmation;

  const date = formatSessionDate(start);
  const time = formatSessionTime({ start, end });
  return sendConfirmationEmail({
    email,
    params: {
      date,
      link,
      time,
    },
    templateId,
  });
};

export default SessionBookedMessageHandler;