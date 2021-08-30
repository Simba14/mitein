const functions = require('firebase-functions');

const admin = require('firebase-admin');
admin.initializeApp();

const SESSIONS = 'sessions';
const BOOKED = 'BOOKED';

// exports.onSessionConfirmation = functions.firestore
//   .document(`${SESSIONS}/{sessionId}`)
//   .onUpdate((change, context) => {
//     const newStatus = change.after.data().status;
//     const prevStatus = change.before.data().status;
//     console.log({ newStatus, prevStatus });
//
//     if (newStatus === BOOKED && newStatus !== prevStatus) {
//       console.log('triggere email');
//     }
//   });

exports.onSessionConfirmation = functions.https.onCall((data, context) => {
  console.log({ data, context });
});
