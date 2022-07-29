import sendUserTokenEmail, {
  USER_VERIFICATION_EMAIL,
} from '@api/pubsub/drivers/sendUserTokenEmail';
import { ROUTE_VERIFY_EMAIL } from 'routes';

const UserCreatedMessageHandler = ({ message }) => {
  const { user } = message;

  return sendUserTokenEmail({
    route: ROUTE_VERIFY_EMAIL,
    emailType: USER_VERIFICATION_EMAIL,
    ...user,
  });
};

export default UserCreatedMessageHandler;
