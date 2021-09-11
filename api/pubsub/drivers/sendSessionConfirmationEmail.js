import emailSender from '@api/pubsub/drivers/emailSender';
import config from '@api/config';
import { ENGLISH } from '@api/firebase/constants/';

const sendSessionConfirmationEmail = ({
  email,
  date,
  displayLanguage,
  time,
  zoomLink,
}) => {
  const {
    sendinblue: { template },
  } = config;
  const templateId =
    displayLanguage === ENGLISH
      ? template.en.sessionConfirmation
      : template.de.sessionConfirmation;

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
