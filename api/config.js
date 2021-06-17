export default {
  port: process.env.PORT,
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV === 'development',
  environment: process.env.NODE_ENV,
  // auth: {
  //   reset_pasword: {
  //     jwt_secret: process.env.RESET_PASSWORD_JWT_SECRET,
  //     jwt_exp_seconds: parseInt(process.env.RESET_PASSWORD_JWT_EXP_SECONDS, 10),
  //   },
  //   verify_email: {
  //     jwt_secret: process.env.VERIFY_EMAIL_JWT_SECRET,
  //     jwt_exp_seconds: parseInt(process.env.VERIFY_EMAIL_JWT_EXP_SECONDS, 10),
  //   },
  //   privileged_key: process.env.PRIVILEGED_KEY,
  // },
  firebase: {
    apiKey: process.env.FIREBASE_API_KEY,
    clientKeys: {
      appId: process.env.FIREBASE_APP_ID,
      authDomain: process.env.FIREBASE_AUTH_DOMAIN,
      databaseURL: process.env.FIREBASE_DATABASE_URL,
      measurementId: process.env.FIREBASE_MEASUREMENT_ID,
      messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      projectId: process.env.FIREBASE_PROJECT_ID,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    },
    serviceAccountKeys: {
      type: process.env.FIREBASE_ADMIN_TYPE,
      project_id: process.env.FIREBASE_PROJECT_ID,
      private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
      private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      client_id: process.env.FIREBASE_CLIENT_ID,
      auth_uri: process.env.FIREBASE_AUTH_URI,
      token_uri: process.env.FIREBASE_TOKEN_URI,
      auth_provider_x509_cert_url:
        process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
      client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
    },
  },
  octopus: {
    apiKey: process.env.OCTOPUS_API_KEY,
    listId: process.env.OCTOPUS_LIST_ID,
  },
  engine: {
    apiKey: process.env.APOLLO_ENGINE_API_KEY,
  },
  winston: {
    winston_level: process.env.WINSTON_LEVEL,
  },
};
