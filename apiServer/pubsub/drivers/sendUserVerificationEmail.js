import jwt from 'jsonwebtoken';
import { log } from '@api/logger';
import emailSender from '@api/pubsub/drivers/emailSender';
import config from '@api/config';
import { GERMAN } from '@api/firebase/constants';

import { ROUTE_VERIFY_EMAIL } from 'routes';

const sendUserVerificationEmail = ({ displayLanguage, email, id }) => {
  try {
    const { jwtExpSeconds: expiresIn, jwtSecret } = config.auth.verifyEmail;
    const token = jwt.sign({ authId: id }, jwtSecret, { expiresIn });

    const {
      uiHost,
      sendinblue: { template },
    } = config;

    const langIsGerman = displayLanguage === GERMAN;
    const templateId = langIsGerman
      ? template.de.userVerification
      : template.en.userVerification;

    const localePath = langIsGerman ? `/${GERMAN}` : '';
    const verifyEmailUrl = `${uiHost}${localePath}${ROUTE_VERIFY_EMAIL}${token}/`;
    log('VERIFY EMAIL URL', 'warning', {
      verifyEmailUrl,
      uiHost,
      localePath,
      ROUTE_VERIFY_EMAIL,
      token,
    });
    return emailSender({
      to: [
        {
          email,
        },
      ],
      templateId,
      params: {
        verifyEmailUrl,
      },
    });
  } catch (error) {
    log(
      '[Notifications] Error sending user verification email',
      'error',
      error,
    );
    throw error;
  }
};

export default sendUserVerificationEmail;
