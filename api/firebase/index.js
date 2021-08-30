import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import config from '@api/config';

const {
  firebase: { apiKey, clientKeys },
} = config;

export const initializeFirebase = fbConfig => {
  if (!firebase.apps.length) {
    firebase.initializeApp(fbConfig);

    if (!config.isProduction) {
      const {
        firebase: {
          emulator: { firestoreHost, authHost },
        },
      } = config;
      const storeElements = firestoreHost.split(':');
      const storeHost = storeElements[0];
      const storePort = Number(storeElements[1]);

      firebase.firestore().useEmulator(storeHost, storePort);
      firebase.auth().useEmulator(authHost);
    }
  }
};

initializeFirebase({ apiKey, ...clientKeys });

export const Firestore = firebase.firestore();
export const FireAuth = firebase.auth();
