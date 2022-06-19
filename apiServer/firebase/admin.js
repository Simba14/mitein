import { getApp, applicationDefault, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import config from '@api/config';

const FireAdmin = {};
export const initializeFirebaseAdmin = () => {
  try {
    const app = getApp();
    FireAdmin.app = app;
  } catch {
    FireAdmin.app = initializeApp({
      credential: applicationDefault(),
      databaseURL: config.firebase.clientKeys.databaseURL,
      projectId: config.firebase.clientKeys.projectId,
    });
  }

  if (!FireAdmin.auth) FireAdmin.auth = getAuth();
};

initializeFirebaseAdmin();
// console.log({ app: applicationDefault() });

export default FireAdmin;
