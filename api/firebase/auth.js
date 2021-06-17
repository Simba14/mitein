import * as firebase from 'firebase/app';
import 'firebase/auth';
import config from '../config.js';
import {
  EMAIL_NOT_FOUND_ERROR_MESSAGE,
  INVALID_PASSWORD_ERROR_MESSAGE,
  INVALID_PASSWORD_ERROR_CODE,
  TOO_MANY_ATTEMPTS_TRY_LATER_ERROR_MESSAGE,
  USER_NOT_FOUND_ERROR_CODE,
  FirebaseEmailTooManyAttemptsError,
  FirebaseWrongCredentialsError,
} from './errors.js';

const {
  firebase: { apiKey, clientKeys },
} = config;

if (!firebase.apps.length) {
  firebase.initializeApp({ apiKey, ...clientKeys });
}

export const signIn = ({ email, password }) =>
  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then(({ user }) => user.uid)
    .catch((error) => {
      console.log('Firebase Sign In', { error });
      if (
        error.message === EMAIL_NOT_FOUND_ERROR_MESSAGE ||
        error.message === INVALID_PASSWORD_ERROR_MESSAGE ||
        error.code === INVALID_PASSWORD_ERROR_CODE ||
        error.code === USER_NOT_FOUND_ERROR_CODE
      )
        throw new FirebaseWrongCredentialsError();

      if (error.message === TOO_MANY_ATTEMPTS_TRY_LATER_ERROR_MESSAGE)
        throw new FirebaseEmailTooManyAttemptsError();

      return Promise.reject(error);
    });

export const signOut = () => firebase.auth().signOut();
