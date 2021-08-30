import jwt from 'jsonwebtoken';
import { log } from '@api/logger';
import emailSender from '@api/pubsub/drivers/emailSender';
import config from '@api/config';

const sendUserVerificationEmail = ({ email, id }) => {
  try {
    const { jwtExpSeconds: expiresIn, jwtSecret } = config.auth.verifyEmail;
    const token = jwt.sign({ authId: id }, jwtSecret, { expiresIn });

    const templateId = config.sendinblue.template.userVerification;
    const emailVerificationUrl = config.sendinblue.emailVerificationUrl;
    const verifyEmailUrl = `${emailVerificationUrl}/${token}/`;

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
