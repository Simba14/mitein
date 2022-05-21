import User from '@api/firebase/user';
import { ValidationError } from '@api/auth/errors';
import { subscribeContactToNewsletter } from '@api/notifications';
import config from '@api/config';

const UsersMutation = {
  signIn: async (obj, args, { auth }, info) => {
    const user = await auth.signIn(args);

    if (user) {
      return user;
    } else {
      throw new ValidationError('Incorrect login details');
    }
  },
  signOut: async (obj, args, { auth }, info) => {
    return auth.signOut();
  },
  signUp: async (obj, args, { auth }, info) => {
    const user = await auth.signUp(args);
    return user;
  },
  newsletterSignUp: async (obj, args, context, info) => {
    const { email } = args;
    await subscribeContactToNewsletter(email);
    return email;
  },
  resetPassword: async (obj, { token, password }, { auth }) => {
    return auth.resetPassword({
      jwtSecret: config.auth.resetPassword.jwtSecret,
      token,
      password,
    });
  },
  resetPasswordRequest: async (obj, { email }, { auth }, info) => {
    return auth.resetPasswordRequest(email);
  },
  updateUser: async (obj, args, context, info) => {
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
