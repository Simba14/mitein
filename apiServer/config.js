import crypto from 'crypto';
import service from '../serviceAccount.enc';

const TRUE = 'true';
const PRODUCTION = 'production';
const DEVELOPMENT = 'development';

const algorithm = 'aes-128-cbc';
let config;
try {
  const decipher = crypto.createDecipheriv(
    algorithm,
    process.env.SERVICE_ENCRYPTION_KEY,
    process.env.SERVICE_ENCRYPTION_IV,
  );

  let decrypted = decipher.update(service.encrypted, 'base64', 'utf8');
  decrypted += decipher.final('utf8');
  config = JSON.parse(decrypted);
} catch (error) {
  console.error('Error decrypting env variables', 'error', error);
}

export default {
  isProduction: process.env.NODE_ENV === PRODUCTION,
  isDevelopment: process.env.NODE_ENV === DEVELOPMENT,
  environment: process.env.NODE_ENV,
  uiHost: process.env.UI_HOST,
  apollo: {
    enablePlayground: process.env.APOLLO_PLAYGROUND === TRUE,
    introspection: process.env.NODE_ENV !== PRODUCTION,
  },
  auth: {
    resetPassword: {
      jwtSecret: config.RESET_PASSWORD_JWT_SECRET,
      jwtExpSeconds: parseInt(config.RESET_PASSWORD_JWT_EXP_SECONDS, 10),
    },
    userVerification: {
      jwtSecret: config.VERIFY_EMAIL_JWT_SECRET,
      jwtExpSeconds: parseInt(config.VERIFY_EMAIL_JWT_EXP_SECONDS, 10),
    },
  },
  firebase: {
    apiKey: config.FIREBASE_API_KEY,
    emulator: {
      authHost: process.env.FIREBASE_EMULATOR_AUTH_HOST,
      firestoreHost: process.env.FIREBASE_EMULATOR_FIRESTORE_HOST,
      projectId: config.FIREBASE_PROJECT_ID,
    },
    clientKeys: {
      appId: config.FIREBASE_APP_ID,
      authDomain: config.FIREBASE_AUTH_DOMAIN,
      databaseURL: config.FIREBASE_DATABASE_URL,
      measurementId: config.FIREBASE_MEASUREMENT_ID,
      messagingSenderId: config.FIREBASE_MESSAGING_SENDER_ID,
      projectId: config.FIREBASE_PROJECT_ID,
      storageBucket: config.FIREBASE_STORAGE_BUCKET,
    },
    serviceAccountKeys: JSON.parse(config.FIREBASE_SERVICE_ACCOUNT_KEYS),
  },
  gcp: {
    email: config.GCP_EMAIL,
    privateKey: config.GCP_PRIVATE_KEY.replace(/\\n/g, '\n'),
    projectId: config.GCP_PROJECT_ID,
    restartSubscriptionIntervalInMinutes:
      config.GCP_RESTART_SUBSCRIPTION_INTERVAL_IN_MINUTES || 15,
    topics: {
      users: config.GCP_PUBSUB_TOPIC_USERS,
      chats: config.GCP_PUBSUB_TOPIC_CHATS,
    },
  },
  sendinblue: {
    apiKey: config.SENDINBLUE_API_KEY,
    baseUrl: config.SENDINBLUE_API_URL,
    listId: Number(config.SENDINBLUE_LIST_ID),
    template: {
      de: {
        chatCancellation: Number(
          config.SENDINBLUE_TEMPLATE_CHAT_CANCELLATION_DE,
        ),
        chatConfirmation: Number(
          config.SENDINBLUE_TEMPLATE_CHAT_CONFIRMATION_DE,
        ),
        chatRequest: Number(config.SENDINBLUE_TEMPLATE_CHAT_REQUEST_DE),
        userVerification: Number(
          config.SENDINBLUE_TEMPLATE_USER_VERIFICATION_DE,
        ),
        resetPassword: Number(
          process.env.SENDINBLUE_TEMPLATE_RESET_PASSWORD_REQUEST_DE,
        ),
      },
      en: {
        chatAvailable: Number(config.SENDINBLUE_TEMPLATE_CHAT_AVAILABLE_EN),
        chatCancellation: Number(
          config.SENDINBLUE_TEMPLATE_CHAT_CANCELLATION_EN,
        ),
        chatConfirmation: Number(
          config.SENDINBLUE_TEMPLATE_CHAT_CONFIRMATION_EN,
        ),
        resetPassword: Number(
          config.SENDINBLUE_TEMPLATE_RESET_PASSWORD_REQUEST_EN,
        ),
        chatRequest: Number(config.SENDINBLUE_TEMPLATE_CHAT_REQUEST_EN),
        userVerification: Number(
          config.SENDINBLUE_TEMPLATE_USER_VERIFICATION_EN,
        ),
      },
    },
  },
  sentry: {
    dsn: config.SENTRY_DSN,
  },
  winston: {
    winstonLevel: process.env.WINSTON_LEVEL,
  },
  zoom: {
    apiKey: config.ZOOM_API_KEY,
    apiSecret: config.ZOOM_API_SECRET,
    baseUrl: config.ZOOM_BASE_API_URL,
    hostEmail: config.ZOOM_HOST_EMAIL,
  },
};
