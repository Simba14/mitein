import User from '@api/firebase/user';
import { ValidationError } from '@api/auth/errors';
import { subscribeContactToNewsletter } from '@api/notifications';
import config from '@api/config';

const UsersMutation = {
  signIn: async (parent, args, { auth }) => {
    const user = await auth.signIn(args);
    if (user) {
      return user;
    } else {
      throw new ValidationError('Incorrect login details');
    }
  },
  signOut: async (parent, args, { auth }) => {
    return auth.signOut();
  },
  signUp: async (parent, args, { auth }) => {
    const user = await auth.signUp(args);
    return user;
  },
  newsletterSignUp: async (parent, args) => {
    const { email } = args;
    await subscribeContactToNewsletter(email);
    return email;
  },
  resetPassword: async (parent, { token, password }, { auth }) => {
    return await auth.resetPassword({
      jwtSecret: config.auth.resetPassword.jwtSecret,
      token,
      password,
    });
  },
  resetPasswordRequest: async (parent, { email }, { auth }) => {
    return auth.resetPasswordRequest(email);
  },
  updateUser: async (parent, args) => {
    const user = await User.updateById(args);
    return user;
  },
  verifyEmail: async (obj, { token }, { auth }) => {
    return auth.verifyEmail({
      token,
      jwtSecret: config.auth.verifyEmail.jwtSecret,
    });
  },
};

export default UsersMutation;
