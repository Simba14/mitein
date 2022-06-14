import { getApp, applicationDefault, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import config from '@api/config';

const FireAdmin = {};
if (!getApp()) {
  FireAdmin.app = initializeApp({
    credential: applicationDefault(),
    databaseURL: config.firebase.clientKeys.databaseURL,
  });

  FireAdmin.auth = getAuth;
}

console.log({ app: applicationDefault() });

export default FireAdmin;
