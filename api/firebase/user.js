import { Firestore } from './admin.js';
import Sessions from './sessions.js';
import { getDocData } from './helpers.js';
import {
  COLLECTION_USERS,
  COLLECTION_SESSIONS,
  USER_TYPE_LEARNER,
  FIELD_PARTICIPANT_ONE,
  FIELD_PARTICIPANT_TWO,
} from './constants.js';

const User = {};

User.create = async ({ id, user }) =>
  Firestore.collection(COLLECTION_USERS)
    .doc(id)
    .set(user)
    .catch(error => console.log({ error }));

User.byId = async id =>
  Firestore.collection(COLLECTION_USERS)
    .doc(id)
    .get()
    .then(getDocData);

User.byIdWithAvailability = async id => {
  const user = await Firestore.collection(COLLECTION_USERS)
    .doc(id)
    .get()
    .then(getDocData)
    .catch(error => {
      console.log('Error getting document:', error);
    });

  const participantField =
    user.type === USER_TYPE_LEARNER
      ? FIELD_PARTICIPANT_TWO
      : FIELD_PARTICIPANT_ONE;

  const sessions = await Sessions.byParticipantId({
    field: participantField,
    id,
  });

  return {
    ...user,
    sessions,
  };
};

User.deleteById = async id =>
  Firestore.collection(COLLECTION_USERS)
    .doc(id)
    .delete();

export default User;
