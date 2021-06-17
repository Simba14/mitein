import User from '../firebase/user.js';
import { ValidationError } from './errors.js';
import * as _firebase from '../firebase/index.js';

export const Auth = ({ firebase = _firebase } = {}) => {
  const auth = {};

  auth.firebase = firebase;

  auth.signUp = async ({ displayName, email, password, type }) => {
    const firebaseUser = await firebase.getAccountByEmail(email);

    if (firebaseUser) throw new ValidationError('user already exists');

    const user = await firebase.createAccount({
      displayName,
      email,
      password,
      type,
    });

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
