import { FireAuth } from '@api/firebase';
import FireAdmin from '@api/firebase/admin';
import User from '@api/firebase/user';
import { GERMAN, ENGLISH, USER_TYPE_LEARNER } from '@api/firebase/constants';
import {
  EMAIL_EXISTS_CODE,
  EMAIL_NOT_FOUND_ERROR_MESSAGE,
  INVALID_PASSWORD_ERROR_MESSAGE,
  WRONG_PASSWORD_ERROR_CODE,
  TOO_MANY_ATTEMPTS_TRY_LATER_ERROR_MESSAGE,
  USER_NOT_FOUND_ERROR_CODE,
  INVALID_PASSWORD_ERROR_CODE,
  FirebaseAccountNotFoundError,
  FirebaseEmailAlreadyExistsError,
  FirebaseEmailTooManyAttemptsError,
  FirebaseWrongCredentialsError,
  FirebaseInvalidPasswordError,
} from '@api/firebase/errors';
import ResetPasswordRequestHandler from '@api/pubsub/handlers/users/resetPasswordRequestMessageHandler';
import { log } from '@api/logger';

export const deleteAccount = () => {
  const user = FireAuth.currentUser;
  user.delete();
};

export const createAccount = ({ displayName, email, password, type }) => {
  return FireAuth.createUserWithEmailAndPassword(email, password)
    .then(async userCredential => {
      const {
        user: { uid, emailVerified },
      } = userCredential;
      const user = {
        id: uid,
        displayName,
        displayLanguage: type === USER_TYPE_LEARNER ? ENGLISH : GERMAN,
        email,
        interests: [],
        isEmailVerified: emailVerified,
        type,
      };

      try {
        await User.create({ id: uid, user });
      } catch (error) {
        deleteAccount();
        log('error creating user', 'error', error);
      }

      return user;
    })
    .catch(error => {
      if (error.code === EMAIL_EXISTS_CODE) {
        throw new FirebaseEmailAlreadyExistsError();
      }
      log(error.message, 'error', error);
    });
};

export const handleResetPasswordRequest = async email => {
  try {
    const user = await User.byEmail(email);
    ResetPasswordRequestHandler({ message: { user } });
    return true;
  } catch (error) {
    log('error handling reset password request', 'error', error);
    throw error;
  }
};

export const setPassword = ({ id, password }) =>
  FireAdmin.auth
    .updateUser(id, { password })
    .then(() => true)
    .catch(error => {
      log('error resetting password', 'error', error);
      if (error.code === USER_NOT_FOUND_ERROR_CODE)
        throw new FirebaseAccountNotFoundError();

      if (error.code === INVALID_PASSWORD_ERROR_CODE)
        throw new FirebaseInvalidPasswordError(error);

      throw error;
    });

export const signIn = ({ email, password }) =>
  FireAuth.signInWithEmailAndPassword(email, password)
    .then(({ user }) => user.uid)
    .catch(error => {
      log('Firebase Sign In', 'error', error);
      if (
        error.message === EMAIL_NOT_FOUND_ERROR_MESSAGE ||
        error.message === INVALID_PASSWORD_ERROR_MESSAGE ||
        error.code === WRONG_PASSWORD_ERROR_CODE ||
        error.code === USER_NOT_FOUND_ERROR_CODE
      )
        throw new FirebaseWrongCredentialsError();

      if (error.message === TOO_MANY_ATTEMPTS_TRY_LATER_ERROR_MESSAGE)
        throw new FirebaseEmailTooManyAttemptsError();

      return Promise.reject(error);
    });

export const signOut = () => FireAuth.signOut();
