import sendResetPasswordRequestEmail, {
  RESET_PASSWORD_REQUEST_EMAIL,
} from '@api/pubsub/drivers/sendUserTokenEmail';
import { ROUTE_RESET_PASSWORD } from 'routes';

const ResetPasswordRequestHandler = ({ message }) => {
  const { user } = message;

  return sendResetPasswordRequestEmail({
    route: ROUTE_RESET_PASSWORD,
    emailType: RESET_PASSWORD_REQUEST_EMAIL,
    ...user,
  });
};

export default ResetPasswordRequestHandler;
