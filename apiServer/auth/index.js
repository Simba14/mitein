import jwt from 'jsonwebtoken';
import User from '@api/firebase/user';
import * as firebaseAuth from '@api/firebase/auth';
import { FirebaseEmailAlreadyExistsError } from '@api/firebase/errors';
import { InvalidTokenError } from '@api/auth/errors';
import UserCreatedMessageHandler from '@api/pubsub/handlers/users/userCreatedMessageHandler';
import ResetPasswordRequestHandler from '@api/pubsub/handlers/users/resetPasswordRequestMessageHandler';

export const Auth = ({ firebase = firebaseAuth } = {}) => {
  const auth = {};

  auth.firebase = firebase;

  auth.signUp = async ({ displayName, email, password, type }) => {
    let user;

    user = await firebase.createAccount({
      displayName,
      email,
      isEmailVerified: false,
      password,
      type,
    });

    if (!user) throw new FirebaseEmailAlreadyExistsError();

    UserCreatedMessageHandler({ message: { user } });

    return {
      ...user,
    };
  };

  auth.resetPassword = async ({ jwtSecret, password, token }) => {
    let decodedToken;

    try {
      decodedToken = jwt.verify(token, jwtSecret);
    } catch (error) {
      throw new InvalidTokenError();
    }

    return await firebase.setPassword({
      id: decodedToken.authId,
      password,
    });
  };

  auth.resetPasswordRequest = async email => {
    const user = await firebase.handleResetPasswordRequest(email);
    ResetPasswordRequestHandler({
      message: { user },
    });
    return true;
  };

  auth.signIn = async ({ email, password }) => {
    const uid = await firebase.signIn({ email, password });
    return User.byId(uid);
  };

  auth.signOut = () => firebase.signOut();

  auth.verifyEmail = async ({ token, jwtSecret }) => {
    let decodedToken;

    try {
      decodedToken = jwt.verify(token, jwtSecret);
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
  };

  return auth;
};
