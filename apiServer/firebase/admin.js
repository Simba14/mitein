import { cert, getApp, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import config from '@api/config';

const FireAdmin = {};
export const initializeFirebaseAdmin = () => {
  const { firebase } = config;
  try {
    const app = getApp();
    FireAdmin.app = app;
  } catch {
    FireAdmin.app = initializeApp({
      credential: cert(firebase.serviceAccountKeys),
      databaseURL: firebase.clientKeys.databaseURL,
      projectId: firebase.clientKeys.projectId,
    });
  }

  if (!FireAdmin.auth) FireAdmin.auth = getAuth();
};

initializeFirebaseAdmin();

export default FireAdmin;
