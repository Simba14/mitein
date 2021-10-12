import User from '@api/firebase/user';
import * as firebaseAuth from '@api/firebase/auth';
import publishUserCreatedMessage from '@api/pubsub/publishers/publishUserCreatedMessage';
import { FirebaseEmailAlreadyExistsError } from '@api/firebase/errors';

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

    publishUserCreatedMessage(user);

    return {
      ...user,
    };
  };

  auth.signIn = async ({ email, password }) => {
    const uid = await firebase.signIn({ email, password });
    return User.byId(uid);
  };

  auth.signOut = () => firebase.signOut();

  return auth;
};