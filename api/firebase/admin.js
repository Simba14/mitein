import admin from 'firebase-admin';
import config from '../config.js';
import User from './user.js';
import { FirebaseAccountNotFoundError } from './errors.js';

const USER_NOT_FOUND_ERROR_CODE = 'auth/user-not-found';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(config.firebase.serviceAccountKeys),
  });
}

export const Firestore = admin.firestore();

export const deleteAccount = (uid) => admin.auth().deleteUser(uid);

export const getAccountByEmail = (email) =>
  admin
    .auth()
    .getUserByEmail(email)
    .then((record) => record.toJSON())
    .catch((error) => {
      if (error.code === USER_NOT_FOUND_ERROR_CODE) {
        return null;
      }

      return Promise.reject(error);
    });

export const getAccountByUid = (uid) =>
  admin
    .auth()
    .getUser(uid)
    .then((record) => record.toJSON())
    .catch((error) => {
      if (error.code === USER_NOT_FOUND_ERROR_CODE) {
        return null;
      }

      return Promise.reject(error);
    });

export const createAccount = ({ displayName, email, password, type }) =>
  admin
    .auth()
    .createUser({
      email,
      password,
    })
    .then(async ({ uid }) => {
      const user = {
        id: uid,
        displayName,
        email,
        isEmailVerified: false,
        type,
      };

      try {
        await User.create({ id: uid, user });
      } catch {
        deleteAccount(uid);
        throw new Error();
      }

      return user;
    });

export const deleteAccountByEmail = async (email) => {
  const account = await getAccountByEmail(email);

  if (!account) return null;

  return deleteAccount(account.uid);
};

export const setPasswordByEmail = async ({ email, password }) => {
  try {
    const user = await admin.auth().getUserByEmail(email);
    return admin.auth().updateUser(user.uid, { password });
  } catch (error) {
    if (error.code === 'auth/user-not-found')
      throw new FirebaseAccountNotFoundError();
    throw error;
  }
};

// export const updatePasswordByEmail = async ({
//   email,
//   newPassword,
//   oldPassword
// }) => {
//   validate.password(newPassword);
//   const account = await rest.findAccountByCreds({
//     email,
//     password: oldPassword
//   });
//   if (!account) throw new FirebaseWrongCredentialsError();
//   await setPasswordByEmail({ email, password: newPassword });
// };
