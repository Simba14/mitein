import { Firestore } from '@api/firebase';
import { getDocData, getQuerySnapshotData } from '@api/firebase/helpers';
import { generateZoomLink } from '@api/zoom';
import User from '@api/firebase/user';
import {
  FirebaseCreateDocError,
  FirebaseGetDocError,
  FirebaseSessionUnavailableError,
} from '@api/firebase/errors';
import {
  COLLECTION_SESSIONS,
  FIELD_PARTICIPANT_ONE,
  FIELD_PARTICIPANT_TWO,
  SESSION_STATUS_AVAILABLE,
  SESSION_STATUS_REQUESTED,
} from '@api/firebase/constants';
import SessionBookedMessageHandler from '@api/pubsub/handlers/sessions/sessionBookedMessageHandler';
import SessionRequestedMessageHandler from '@api/pubsub/handlers/sessions/sessionRequestedMessageHandler';

const Sessions = {};

Sessions.create = async ({ id, session }) =>
  Firestore.collection(COLLECTION_SESSIONS)
    .doc(id)
    .set({ lastUpdated: new Date().toISOString(), ...session })
    .then(() => session)
    .catch(() => {
      throw new FirebaseCreateDocError('Creation of Session doc failed');
    });

Sessions.byId = async id =>
  Firestore.collection(COLLECTION_SESSIONS).doc(id).get().then(getDocData);

Sessions.byStatus = async status =>
  Firestore.collection(COLLECTION_SESSIONS)
    .where('status', '==', status)
    .orderBy('start', 'desc')
    .get()
    .then(getDocData)
    .catch(() => {
      throw new FirebaseGetDocError('Could not return session by status');
    });

Sessions.byParticipantId = async ({ field, id }) =>
  Firestore.collection(COLLECTION_SESSIONS)
    .where(field, '==', id)
    .orderBy('start')
    .get()
    .then(getQuerySnapshotData)
    .catch(() => {
      throw new FirebaseGetDocError('Could not return session by user');
    });

Sessions.byParticipantIdWithStatusCondition = async ({
  condition,
  field,
  id,
  status,
  upcoming,
}) => {
  let baseQuery = Firestore.collection(COLLECTION_SESSIONS)
    .where(field, '==', id)
    .where('status', condition, status);

  if (upcoming) {
    baseQuery = baseQuery.where('start', '>', new Date().toISOString());
  }
  return baseQuery
    .get()
    .then(getQuerySnapshotData)
    .catch(() => {
      throw new FirebaseGetDocError('Could not return session by user/status');
    });
};

Sessions.byFilters = async ({
  notOneOf,
  participant1Id,
  participant2Id,
  status,
  upcoming,
}) => {
  const participantArgs = {
    field: participant1Id ? FIELD_PARTICIPANT_ONE : FIELD_PARTICIPANT_TWO,
    id: participant1Id || participant2Id,
  };

  if (participantArgs.id) {
    if (status) {
      return await Sessions.byParticipantIdWithStatusCondition({
        ...participantArgs,
        condition: '==',
        status,
        upcoming,
      });
    }

    if (notOneOf) {
      return await Sessions.byParticipantIdWithStatusCondition({
        ...participantArgs,
        condition: 'not-in',
        status: notOneOf,
        upcoming,
      });
    }

    return await Sessions.byParticipantId(participantArgs);
  }

  return await Sessions.byStatus(status);
};

Sessions.getOnlyAvailable = async () => {
  let dateConstraint = new Date();
  dateConstraint.setDate(dateConstraint.getDate() + 1);
  dateConstraint.setHours(0, 0, 0); // set to tomorrow

  return await Firestore.collection(COLLECTION_SESSIONS)
    .where('status', '==', SESSION_STATUS_AVAILABLE)
    .where('start', '>', dateConstraint.toISOString())
    .get()
    .then(getQuerySnapshotData);
};

Sessions.updateById = async ({ id, fields }) => {
  const lastUpdated = new Date().toISOString();
  return Firestore.collection(COLLECTION_SESSIONS)
    .doc(id)
    .update({ lastUpdated, ...fields })
    .then(() => ({ id, lastUpdated, ...fields }));
};

Sessions.onConfirmation = async session => {
  const { participant1Id, participant2Id } = session;

  const participants = await Promise.all([
    User.byId(participant1Id),
    User.byId(participant2Id),
  ]);

  participants.forEach((participant, index) =>
    SessionBookedMessageHandler({
      message: {
        participant,
        session,
        topics: participants[index ? 0 : 1]?.interests,
      },
    }),
  );
};

Sessions.book = async ({ id, fields }) => {
  const isRequested =
    (await Sessions.byId(id)?.status) === SESSION_STATUS_REQUESTED;
  if (!isRequested) throw new FirebaseSessionUnavailableError();

  const link = await generateZoomLink(fields.start);
  const session = await Sessions.updateById({
    id,
    fields: { link, ...fields },
  });

  Sessions.onConfirmation(session);
  return session;
};

Sessions.onRequested = async session => {
  const { participant1Id } = session;
  const participant1 = await User.byId(participant1Id);
  const participant1Sessions =
    await Sessions.byParticipantIdWithStatusCondition({
      id: participant1Id,
      field: FIELD_PARTICIPANT_ONE,
      status: SESSION_STATUS_REQUESTED,
      condition: '==',
    });

  const requestsToday = participant1Sessions.filter(
    session =>
      new Date(session.lastUpdated).toDateString() ===
      new Date().toDateString(),
  ).length;

  // limit session requested emails to 1 per day
  if (requestsToday <= 1)
    SessionRequestedMessageHandler({
      message: {
        participant: participant1,
        session,
      },
    });
};

Sessions.request = async ({ id, fields }) => {
  const session = await Sessions.updateById({
    id,
    fields,
  });

  Sessions.onRequested(fields);
  return session;
};

Sessions.deleteById = id =>
  Firestore.collection(COLLECTION_SESSIONS).doc(id).delete();

Sessions.deleteByAvailabilityId = id =>
  Firestore.collection(COLLECTION_SESSIONS)
    .where('availabilityId', '==', id)
    .get()
    .then(querySnapshot => querySnapshot.forEach(doc => doc.ref.delete()));

export default Sessions;
