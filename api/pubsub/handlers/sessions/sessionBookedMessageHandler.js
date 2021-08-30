import sendSessionConfirmationEmail from '@api/pubsub/drivers/sendSessionConfirmationEmail';
import { formatSessionDate, formatSessionTime } from 'helpers/index';

const SessionBookedMessageHandler = ({
  sendConfirmationEmail = sendSessionConfirmationEmail,
  message,
}) => {
  const {
    participant: { email },
    session: { start, end, link },
  } = message;

  const date = formatSessionDate(start);
  const time = formatSessionTime({ start, end });
  return sendConfirmationEmail({ email, date, time, zoomLink: link });
};

export default SessionBookedMessageHandler;
