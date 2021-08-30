import emailSender from '@api/pubsub/drivers/emailSender';
import config from '@api/config';

const sendSessionConfirmationEmail = ({ email, date, time, zoomLink }) => {
  const templateId = config.sendinblue.template.sessionConfirmation;

  return emailSender({
    to: [
      {
        email,
      },
    ],
    templateId,
    params: {
      date,
      time,
      zoomLink,
    },
  });
};

export default sendSessionConfirmationEmail;
