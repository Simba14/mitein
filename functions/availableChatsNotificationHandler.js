const { getUsersWithAvailabilityMatch } = require('./helpers');

const AVAILABILITY = 'availability';
const LEARNER = 'LEARNER';
const CHATS = 'chats';
const CHAT_STATUS_AVAILABLE = 'AVAILABLE';
const USERS = 'users';

const getUserEmails = docs => {
  let emails = [];
  docs.map(doc => {
    if (doc && doc.exists) emails.push({ email: doc.data().email });
  });
  return emails;
};

exports.availableChatsNotificationHandler = async function (database) {
  let dateConstraint = new Date();
  dateConstraint.setDate(dateConstraint.getDate() + 1);
  dateConstraint.setHours(0, 0, 0); // set to tomorrow
  const availableChats = await database
    .collection(CHATS)
    .where('status', '==', CHAT_STATUS_AVAILABLE)
    .where('start', '>', dateConstraint.toISOString())
    .get()
    .then(querySnapshot => querySnapshot.docs.map(doc => doc.data().start));

  const uniqueAvailableStarts = [...new Set(availableChats)].map(start => ({
    start,
    day: new Date(start).getDay(),
  }));

  const availabilities = await database
    .collection(AVAILABILITY)
    .where('userType', '==', LEARNER)
    .get()
    .then(querySnapshot => querySnapshot.docs.map(doc => doc.data()));

  const users = getUsersWithAvailabilityMatch({
    availabilities,
    availableChats: uniqueAvailableStarts,
  });

  if (!users.length) return;
  const refs = users.map(id => database.collection(USERS).doc(id));
  return await database.getAll(...refs).then(getUserEmails);
};
