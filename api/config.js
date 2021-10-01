const TRUE = 'true';
const PRODUCTION = 'production';
const DEVELOPMENT = 'development';

export default {
  port: process.env.PORT,
  isProduction: process.env.NODE_ENV === PRODUCTION,
  isDevelopment: process.env.NODE_ENV === DEVELOPMENT,
  environment: process.env.NODE_ENV,
  uiHost: process.env.UI_HOST,
  apollo: {
    enablePlayground: process.env.APOLLO_PLAYGROUND === TRUE,
    introspection: process.env.NODE_ENV !== PRODUCTION,
  },
  auth: {
    verifyEmail: {
      jwtSecret: process.env.VERIFY_EMAIL_JWT_SECRET,
      jwtExpSeconds: parseInt(process.env.VERIFY_EMAIL_JWT_EXP_SECONDS, 10),
    },
  },
  firebase: {
    apiKey: process.env.FIREBASE_API_KEY,
    emulator: {
      authHost: process.env.FIREBASE_EMULATOR_AUTH_HOST,
      firestoreHost: process.env.FIREBASE_EMULATOR_FIRESTORE_HOST,
      projectId: process.env.FIREBASE_PROJECT_ID,
    },
    clientKeys: {
      appId: process.env.FIREBASE_APP_ID,
      authDomain: process.env.FIREBASE_AUTH_DOMAIN,
      databaseURL: process.env.FIREBASE_DATABASE_URL,
      measurementId: process.env.FIREBASE_MEASUREMENT_ID,
      messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      projectId: process.env.FIREBASE_PROJECT_ID,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    },
  },
  gcp: {
    email: process.env.GCP_EMAIL,
    privateKey: process.env.GCP_PRIVATE_KEY.replace(/\\n/g, '\n'),
    projectId: process.env.GCP_PROJECT_ID,
    restartSubscriptionIntervalInMinutes:
      process.env.GCP_RESTART_SUBSCRIPTION_INTERVAL_IN_MINUTES || 15,
    topics: {
      users: process.env.GCP_PUBSUB_TOPIC_USERS,
      sessions: process.env.GCP_PUBSUB_TOPIC_SESSIONS,
    },
  },
  sendinblue: {
    apiKey: process.env.SENDINBLUE_API_KEY,
    baseUrl: process.env.SENDINBLUE_API_URL,
    listId: Number(process.env.SENDINBLUE_LIST_ID),
    template: {
      de: {
        sessionConfirmation: Number(
          process.env.SENDINBLUE_TEMPLATE_SESSION_CONFIRMATION_DE,
        ),
        sessionRequest: Number(
          process.env.SENDINBLUE_TEMPLATE_SESSION_REQUEST_DE,
        ),
        userVerification: Number(
          process.env.SENDINBLUE_TEMPLATE_USER_VERIFICATION_DE,
        ),
      },
      en: {
        sessionConfirmation: Number(
          process.env.SENDINBLUE_TEMPLATE_SESSION_CONFIRMATION_EN,
        ),
        sessionRequest: Number(
          process.env.SENDINBLUE_TEMPLATE_SESSION_REQUEST_EN,
        ),
        userVerification: Number(
          process.env.SENDINBLUE_TEMPLATE_USER_VERIFICATION_EN,
        ),
      },
    },
  },
  engine: {
    apiKey: process.env.APOLLO_ENGINE_API_KEY,
  },
  winston: {
    winstonLevel: process.env.WINSTON_LEVEL,
  },
  zoom: {
    apiKey: process.env.ZOOM_API_KEY,
    apiSecret: process.env.ZOOM_API_SECRET,
    baseUrl: process.env.ZOOM_BASE_API_URL,
    hostEmail: process.env.ZOOM_HOST_EMAIL,
  },
};
