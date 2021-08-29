import sendUserVerificationEmail from '@api/pubsub/drivers/sendUserVerificationEmail';

const UserCreatedMessageHandler = ({ message }) => {
  const { user } = message;

  return sendUserVerificationEmail(user);
};

export default UserCreatedMessageHandler;
