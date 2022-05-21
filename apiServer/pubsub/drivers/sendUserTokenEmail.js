import jwt from 'jsonwebtoken';
import { log } from '@api/logger';
import emailSender from '@api/pubsub/drivers/emailSender';
import config from '@api/config';
import { GERMAN } from '@api/firebase/constants';

export const USER_VERIFICATION_EMAIL = 'userVerification';
export const RESET_PASSWORD_REQUEST_EMAIL = 'resetPassword';

const sendUserTokenEmail = ({
  displayLanguage,
  email,
  id,
  route,
  emailType,
}) => {
  try {
    const { jwtExpSeconds: expiresIn, jwtSecret } = config.auth[emailType];
    const token = jwt.sign({ authId: id }, jwtSecret, { expiresIn });

    const {
      uiHost,
      sendinblue: { template },
    } = config;

    const langIsGerman = displayLanguage === GERMAN;
    const templateId = langIsGerman
      ? template.de[emailType]
      : template.en[emailType];

    const localePath = langIsGerman ? `/${GERMAN}` : '';
    const userUrl = `${uiHost}${localePath}${route}${token}/`;

    return emailSender({
      to: [
        {
          email,
        },
      ],
      templateId,
      params: {
        userUrl,
      },
    });
  } catch (error) {
    log(`[Notifications] Error sending ${emailType} email`, 'error', error);
    throw error;
  }
};

export default sendUserTokenEmail;
