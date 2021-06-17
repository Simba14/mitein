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
    .catch(error => console.log({ error, session }));

Sessions.byId = async id =>
  Firestore.collection(COLLECTION_SESSIONS)
    .doc(id)
    .get()
    .then(getDocData);

Sessions.byStatus = async status =>
  Firestore.collection(COLLECTION_SESSIONS)
    .where('status', '==', status)
    .get()
    .then(getDocData)
    .catch(error => console.log({ error }));

Sessions.byParticipantId = async ({ field, id }) =>
  Firestore.collection(COLLECTION_SESSIONS)
    .where(field, '==', id)
    .get()
    .then(getQuerySnapshotData)
    .catch(error => console.log({ error, field, id }));

Sessions.byParticipantIdWithStatus = async ({ field, id, status }) =>
  Firestore.collection(COLLECTION_SESSIONS)
    .where(field, '==', id)
    .where('status', '==', status)
    .get()
    .then(getQuerySnapshotData)
    .catch(error => console.log({ error }));

Sessions.byFilters = async ({ participant1Id, participant2Id, status }) => {
  const participantArgs = {
    field: participant1Id ? FIELD_PARTICIPANT_ONE : FIELD_PARTICIPANT_TWO,
    id: participant1Id || participant2Id,
  };

  if (participantArgs.id) {
    if (status) {
      return await Sessions.byParticpantIdWithStatus({
        ...participantArgs,
        status,
      });
    } else {
      return await Sessions.byParticipantId(participantArgs);
    }
  }

  return await Sessions.byStatus(status);
};

Sessions.getOnlyAvailable = async () => {
  let dateConstraint = new Date();
  dateConstraint.setDate(dateConstraint.getDate() + 1);
  // dateConstraint = `${dateConstraint}`;
  return await Firestore.collection(COLLECTION_SESSIONS)
    .where('status', '==', SESSION_STATUS_AVAILABLE)
    .where('start', '>', dateConstraint.toISOString())
    .get()
    .then(querySnapshot => {
      console.log({
        querySnapshot,
        status: SESSION_STATUS_AVAILABLE,
        date: dateConstraint,
        dateStr: dateConstraint.toISOString(),
        map: querySnapshot.docs.map(doc => doc.data()),
      });
      return querySnapshot.docs.map(doc => doc.data());
    })
    .catch(error => console.log({ error }));
};

Sessions.updateById = async ({ id, fields }) =>
  Firestore.collection(COLLECTION_SESSIONS)
    .doc(id)
    .set(fields, { merge: true })
    .then(doc => console.log({ doc }));

Sessions.deleteById = id =>
  Firestore.collection(COLLECTION_SESSIONS)
    .doc(id)
    .delete();

export default Sessions;
