import { FireAuth } from '@api/firebase';
import User from '@api/firebase/user';
import { GERMAN, ENGLISH, USER_TYPE_LEARNER } from '@api/firebase/constants';
import {
  EMAIL_EXISTS_CODE,
  EMAIL_NOT_FOUND_ERROR_MESSAGE,
  INVALID_PASSWORD_ERROR_MESSAGE,
  INVALID_PASSWORD_ERROR_CODE,
  TOO_MANY_ATTEMPTS_TRY_LATER_ERROR_MESSAGE,
  USER_NOT_FOUND_ERROR_CODE,
  FirebaseAccountNotFoundError,
  FirebaseEmailAlreadyExistsError,
  FirebaseEmailTooManyAttemptsError,
  FirebaseWrongCredentialsError,
} from '@api/firebase/errors';

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
        console.log('error creating user', { error });
      }

      return user;
    })
    .catch(error => {
      if (error.code === EMAIL_EXISTS_CODE) {
        throw new FirebaseEmailAlreadyExistsError();
      }
      console.log({ error });
    });
};

export const handleResetPasswordRequest = async email => {
  try {
    const user = await User.byEmail(email);
    return user;
  } catch (error) {
    console.log('error handling reset password request', { error });
    throw error;
  }
};

// export const setPasswordByEmail = async ({ code, email, password }) => {
//   try {
//     // const user = await FireAuth.getUserByEmail(email);
//     const validEmail = await FireAuth.verifyPasswordResetCode(code);
//     const isValid = validEmail === email;
//     console.log(validEmail);
//     // return FireAuth.updateUser(user.uid, { password });
//     if (isValid) await FireAuth.confirmPasswordReset(code, password);
//     return true;
//   } catch (error) {
//     if (error.code === USER_NOT_FOUND_ERROR_CODE)
//       throw new FirebaseAccountNotFoundError();
//     throw error;
//   }
// };

export const setPassword = async ({ id, password }) => {
  try {
    const user = await FireAuth.updateCurrentUser({ uid: id });

    return await user.updatePassword(password);
  } catch (error) {
    if (error.code === USER_NOT_FOUND_ERROR_CODE)
      throw new FirebaseAccountNotFoundError();
    throw error;
  }
};

export const signIn = ({ email, password }) =>
  FireAuth.signInWithEmailAndPassword(email, password)
    .then(({ user }) => user.uid)
    .catch(error => {
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

export const signOut = () => FireAuth.signOut();
