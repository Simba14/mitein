const functions = require('firebase-functions');
const { getFirestore } = require('firebase-admin/firestore');
const { initializeApp, applicationDefault } = require('firebase-admin/app');
const { sendEmail } = require('./notifications/sendEmail');
const {
  availableChatsNotificationHandler,
} = require('./availableChatsNotificationHandler');

initializeApp({
  credential: applicationDefault(),
});

const db = getFirestore();

// Comment out the below to test the scheduled function via the emulator
// const { PubSub } = require('@google-cloud/pubsub');

// const pubsub = new PubSub({
//   projectId: process.env.GCLOUD_PROJECT,
//   apiEndpoint: 'localhost:5005',
// });

// const SCHEDULED_FUNCTION_TOPIC =
//   'firebase-schedule-scheduledAvailableChatsNotification';

// setInterval(async () => {
//   console.log(
//     `Trigger scheduled function via PubSub topic: ${SCHEDULED_FUNCTION_TOPIC}`,
//   );
//   const msg = await pubsub
//     .topic(SCHEDULED_FUNCTION_TOPIC)
//     .publishJSON(
//       {
//         foo: 'bar',
//       },
//       { attr1: 'value1' },
//     )
//     .catch(error => console.log({ error }));
// }, 1 * 60 * 1000);

const TIME_ZONE = 'Europe/Berlin';

exports.scheduledAvailableChatsNotification = functions
  .runWith({
    secrets: ['SENDINBLUE_TEMPLATE_CHAT_AVAILABLE_EN', 'SENDINBLUE_API_KEY'],
  })
  .pubsub.schedule('0 17 * * SUN') // runs every Sunday 5pm CEST
  .timeZone(TIME_ZONE)
  .onRun(async () => {
    const emails = await availableChatsNotificationHandler(db);
    if (!emails) return;

    const templateId = Number(
      process.env.SENDINBLUE_TEMPLATE_CHAT_AVAILABLE_EN,
    );

    return sendEmail(process.env.SENDINBLUE_API_KEY)({
      to: emails,
      templateId,
    });
  });
