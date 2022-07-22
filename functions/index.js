const functions = require('firebase-functions');
const { initializeApp, applicationDefault } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const { sendEmail } = require('./notifications/sendEmail');
const { getUsersWithAvailabilityMatch } = require('./helpers');

const DATABASE_URL = 'https://mitein-3c0d1.firebaseio.com';

initializeApp({
  credential: applicationDefault(),
  databaseURL: process.env.FIREBASE_DATABASE_URL,
});

console.log(process.env.GCLOUD_PROJECT);

const db = getFirestore();

// Comment out the below to test the scheduled function locally
const { PubSub } = require('@google-cloud/pubsub');

const pubsub = new PubSub({
  projectId: process.env.GCLOUD_PROJECT,
  apiEndpoint: 'localhost:5005',
});

const SCHEDULED_FUNCTION_TOPIC =
  'firebase-schedule-scheduledAvailableChatsNotification';

setInterval(async () => {
  console.log(
    `Trigger scheduled function via PubSub topic: ${SCHEDULED_FUNCTION_TOPIC}`,
  );
  const msg = await pubsub
    .topic(SCHEDULED_FUNCTION_TOPIC)
    .publishJSON(
      {
        foo: 'bar',
      },
      { attr1: 'value1' },
    )
    .catch(error => console.log({ error }));
}, 1 * 60 * 1000);

const AVAILABILITY = 'availability';
const LEARNER = 'LEARNER';
const CHATS = 'chats';
const CHAT_STATUS_AVAILABLE = 'AVAILABLE';
const USERS = 'users';

const TIME_ZONE = 'Europe/Berlin';

const getUserEmails = docs => {
  let emails = [];
  docs.map(doc => {
    if (doc && doc.exists) emails.push({ email: doc.data().email });
  });
  return emails;
};

exports.scheduledAvailableChatsNotification = functions
  .runWith({
    secrets: ['SENDINBLUE_TEMPLATE_CHAT_AVAILABLE_EN', 'SENDINBLUE_API_KEY'],
  })
  .pubsub.schedule('* * * * *') // runs every Sunday 5pm CEST
  .timeZone(TIME_ZONE)
  .onRun(async () => {
    let dateConstraint = new Date();
    dateConstraint.setDate(dateConstraint.getDate() + 1);
    dateConstraint.setHours(0, 0, 0); // set to tomorrow
    const availableChats = await db
      .collection(CHATS)
      .where('status', '==', CHAT_STATUS_AVAILABLE)
      .where('start', '>', dateConstraint.toISOString())
      .get()
      .then(querySnapshot => querySnapshot.docs.map(doc => doc.data().start));
    console.log(
      { availableChats },
      process.env,
      'INSIDEINSIDEINSIDEINSIDEINSIDEINSIDE',
    );

    const uniqueAvailableStarts = [...new Set(availableChats)].map(start => ({
      start,
      day: new Date(start).getDay(),
    }));

    const availabilities = await db
      .collection(AVAILABILITY)
      .where('userType', '==', LEARNER)
      .get()
      .then(querySnapshot => querySnapshot.docs.map(doc => doc.data()));

    const users = getUsersWithAvailabilityMatch({
      availabilities,
      availableChats: uniqueAvailableStarts,
    });

    if (!users.length) return;
    const refs = users.map(id => db.collection(USERS).doc(id));
    const emails = await db.getAll(...refs).then(getUserEmails);

    const templateId = Number(
      process.env.SENDINBLUE_TEMPLATE_CHAT_AVAILABLE_EN,
    );
    console.log({ templateId });
    // return sendEmail({
    //   to: emails,
    //   templateId,
    // });
  });
