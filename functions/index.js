const functions = require('firebase-functions');
const { initializeApp, applicationDefault } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const { sendEmail } = require('./notifications/sendEmail');
const { getUsersWithAvailabilityMatch } = require('./helpers');

const DATABASE_URL = 'https://mitein-3c0d1.firebaseio.com';

initializeApp({
  credential: applicationDefault(),
  databaseURL: DATABASE_URL,
});

const db = getFirestore();

// Comment out the below to test the scheduled function locally
// const { PubSub } = require('@google-cloud/pubsub');

// const pubsub = new PubSub({
//   projectId: 'REQUEST FROM DEVELOPER',
//   apiEndpoint: 'localhost:5005',
// });

// const SCHEDULED_FUNCTION_TOPIC =
//   'firebase-schedule-scheduledAvailableSessionsNotification';

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

const AVAILABILITY = 'availability';
const LEARNER = 'LEARNER';
const SESSIONS = 'sessions';
const SESSION_STATUS_AVAILABLE = 'AVAILABLE';
const USERS = 'users';

const TIME_ZONE = 'Europe/Berlin';

const getUserEmails = docs => {
  let emails = [];
  docs.map(doc => {
    if (doc && doc.exists) emails.push({ email: doc.data().email });
  });
  return emails;
};

exports.scheduledAvailableSessionsNotification = functions.pubsub
  .schedule('0 17 * * SUN') // runs every Sunday 5pm CEST
  .timeZone(TIME_ZONE)
  .onRun(async () => {
    let dateConstraint = new Date();
    dateConstraint.setDate(dateConstraint.getDate() + 1);
    dateConstraint.setHours(0, 0, 0); // set to tomorrow

    const availableSessions = await db
      .collection(SESSIONS)
      .where('status', '==', SESSION_STATUS_AVAILABLE)
      .where('start', '>', dateConstraint.toISOString())
      .get()
      .then(querySnapshot => querySnapshot.docs.map(doc => doc.data().start));

    const uniqueAvailableStarts = [...new Set(availableSessions)].map(
      start => ({
        start,
        day: new Date(start).getDay(),
      }),
    );

    const availabilities = await db
      .collection(AVAILABILITY)
      .where('userType', '==', LEARNER)
      .get()
      .then(querySnapshot => querySnapshot.docs.map(doc => doc.data()));

    const users = getUsersWithAvailabilityMatch({
      availabilities,
      availableSessions: uniqueAvailableStarts,
    });

    if (!users.length) return;
    const refs = users.map(id => db.collection(USERS).doc(id));
    const emails = await db.getAll(...refs).then(getUserEmails);

    const templateId = Number(
      functions.config().sendinblue.template_session_available_en,
    );

    return sendEmail({
      to: emails,
      templateId,
    });
  });
