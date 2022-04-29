import jwt from 'jsonwebtoken';
import User from '@api/firebase/user';
import { InvalidTokenError, ValidationError } from '@api/auth/errors';
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
  signOut: async (parent, args, { auth }, info) => {
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
  updateUser: async (obj, args, context, info) => {
    console.log({ ...args });
    const user = await User.updateById(args);
    console.log({ user });
    return user;
  },
  verifyEmail: async (parent, { token }) => {
    let decodedToken;

    try {
      decodedToken = jwt.verify(token, config.auth.verifyEmail.jwtSecret);
    } catch (error) {
      throw new InvalidTokenError();
    }

    await User.updateById({
      id: decodedToken.authId,
      fields: {
        isEmailVerified: true,
      },
    });

    return true;
  },
};

export default UsersMutation;
