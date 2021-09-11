import sendSessionConfirmationEmail from '@api/pubsub/drivers/sendSessionConfirmationEmail';
import { formatSessionDate, formatSessionTime } from 'helpers/index';

const SessionBookedMessageHandler = ({
  sendConfirmationEmail = sendSessionConfirmationEmail,
  message,
}) => {
  const {
    participant: { displayLanguage, email },
    session: { start, end, link },
  } = message;

  const date = formatSessionDate(start);
  const time = formatSessionTime({ start, end });
  return sendConfirmationEmail({
    displayLanguage,
    email,
    date,
    time,
    zoomLink: link,
  });
};

export default SessionBookedMessageHandler;
