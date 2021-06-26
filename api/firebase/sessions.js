import { Firestore } from './admin.js';
import { getDocData, getQuerySnapshotData } from './helpers.js';
import {
  COLLECTION_SESSIONS,
  FIELD_PARTICIPANT_ONE,
  FIELD_PARTICIPANT_TWO,
  SESSION_STATUS_AVAILABLE,
} from './constants.js';

const Sessions = {};

Sessions.create = async ({ id, session }) =>
  Firestore.collection(COLLECTION_SESSIONS)
    .doc(id)
    .set(session)
    .then(() => session)
    .catch((error) => console.log({ error, session }));

Sessions.byId = async (id) =>
  Firestore.collection(COLLECTION_SESSIONS).doc(id).get().then(getDocData);

Sessions.byStatus = async (status) =>
  Firestore.collection(COLLECTION_SESSIONS)
    .where('status', '==', status)
    .orderBy('start', 'desc')
    .get()
    .then(getDocData)
    .catch((error) => console.log({ error }));

Sessions.byParticipantId = async ({ field, id }) =>
  Firestore.collection(COLLECTION_SESSIONS)
    .where(field, '==', id)
    .orderBy('start', 'desc')
    .get()
    .then(getQuerySnapshotData)
    .catch((error) => console.log({ error, field, id }));

Sessions.byParticipantIdWithStatusCondition = async ({
  field,
  id,
  status,
  condition,
}) =>
  Firestore.collection(COLLECTION_SESSIONS)
    .where(field, '==', id)
    .where('status', condition, status)
    .get()
    .then(getQuerySnapshotData)
    .catch((error) => console.log({ error }));

Sessions.byFilters = async ({
  participant1Id,
  participant2Id,
  status,
  notOneOf,
}) => {
  const participantArgs = {
    field: participant1Id ? FIELD_PARTICIPANT_ONE : FIELD_PARTICIPANT_TWO,
    id: participant1Id || participant2Id,
  };

  if (participantArgs.id) {
    if (status) {
      return await Sessions.byParticipantIdWithStatusCondition({
        ...participantArgs,
        status,
        condition: '==',
      });
    }

    if (notOneOf) {
      return await Sessions.byParticipantIdWithStatusCondition({
        ...participantArgs,
        status: notOneOf,
        condition: 'not-in',
      });
    }

    return await Sessions.byParticipantId(participantArgs);
  }

  return await Sessions.byStatus(status);
};

Sessions.getOnlyAvailable = async () => {
  let dateConstraint = new Date();
  dateConstraint.setDate(dateConstraint.getDate() + 1);

  return await Firestore.collection(COLLECTION_SESSIONS)
    .where('status', '==', SESSION_STATUS_AVAILABLE)
    .where('start', '>', dateConstraint.toISOString())
    .get()
    .then((querySnapshot) => {
      return querySnapshot.docs.map((doc) => doc.data());
    })
    .catch((error) => console.log({ error }));
};

Sessions.updateById = async ({ id, fields }) =>
  Firestore.collection(COLLECTION_SESSIONS)
    .doc(id)
    .set(fields, { merge: true })
    .then((doc) => console.log({ doc }));

Sessions.deleteById = (id) =>
  Firestore.collection(COLLECTION_SESSIONS).doc(id).delete();

export default Sessions;
