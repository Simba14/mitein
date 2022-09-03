import { Firestore } from '@api/firebase';
import { isEmpty, uniqWith } from 'lodash/fp';
import { getDocData, getQuerySnapshotData } from '@api/firebase/helpers';
import { generateZoomLink } from '@api/zoom';
import User from '@api/firebase/user';
import {
  FirebaseCreateDocError,
  FirebaseGetDocError,
} from '@api/firebase/errors';
import {
  COLLECTION_CHATS,
  FIELD_PARTICIPANT_ONE,
  FIELD_PARTICIPANT_TWO,
  CHAT_STATUS_AVAILABLE,
  CHAT_STATUS_REQUESTED,
  CHAT_STATUS_BOOKED,
} from '@api/firebase/constants';
import ChatBookedMessageHandler from '@api/pubsub/handlers/chats/chatBookedMessageHandler';
import ChatRequestedMessageHandler from '@api/pubsub/handlers/chats/chatRequestedMessageHandler';

const Chat = {};

Chat.create = async ({ id, chat }) =>
  Firestore.collection(COLLECTION_CHATS)
    .doc(id)
    .set({ lastUpdated: new Date().toISOString(), ...chat })
    .then(() => chat)
    .catch(() => {
      throw new FirebaseCreateDocError('Creation of Chat doc failed');
    });

Chat.byId = async id =>
  Firestore.collection(COLLECTION_CHATS).doc(id).get().then(getDocData);

Chat.byStatus = async status =>
  Firestore.collection(COLLECTION_CHATS)
    .where('status', '==', status)
    .orderBy('start', 'desc')
    .get()
    .then(getDocData)
    .catch(() => {
      throw new FirebaseGetDocError('Could not return chat by status');
    });

Chat.byParticipantId = async ({ field, id }) =>
  Firestore.collection(COLLECTION_CHATS)
    .where(field, '==', id)
    .orderBy('start')
    .get()
    .then(getQuerySnapshotData)
    .catch(() => {
      throw new FirebaseGetDocError('Could not return chat by user');
    });

Chat.byParticipantIdWithStatusCondition = async ({
  condition,
  field,
  id,
  status,
  upcoming,
}) => {
  let baseQuery = Firestore.collection(COLLECTION_CHATS)
    .where(field, '==', id)
    .where('status', condition, status);

  if (upcoming) {
    baseQuery = baseQuery.where('start', '>', new Date().toISOString());
  }
  return baseQuery
    .get()
    .then(getQuerySnapshotData)
    .catch(() => {
      throw new FirebaseGetDocError('Could not return chat by user/status');
    });
};

Chat.byFilters = async ({
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
      return await Chat.byParticipantIdWithStatusCondition({
        ...participantArgs,
        condition: '==',
        status,
        upcoming,
      });
    }

    if (notOneOf) {
      return await Chat.byParticipantIdWithStatusCondition({
        ...participantArgs,
        condition: 'not-in',
        status: notOneOf,
        upcoming,
      });
    }

    return await Chat.byParticipantId(participantArgs);
  }

  return await Chat.byStatus(status);
};

Chat.getOnlyAvailable = async () => {
  let dateConstraint = new Date();
  dateConstraint.setDate(dateConstraint.getDate() + 1);
  dateConstraint.setHours(0, 0, 0); // set to tomorrow

  // Due to Zoom limits, we can only facilitate one chat per time slot.
  // Therefore, already requested / booked times cannot be requested
  const unavailableChats = await Firestore.collection(COLLECTION_CHATS)
    .where('status', 'in', [CHAT_STATUS_REQUESTED, CHAT_STATUS_BOOKED])
    .where('start', '>', dateConstraint.toISOString())
    .get()
    .then(getQuerySnapshotData)
    .then(data => data.map(chat => chat.start));

  return await Firestore.collection(COLLECTION_CHATS)
    .where('status', '==', CHAT_STATUS_AVAILABLE)
    .where('start', '>', dateConstraint.toISOString())
    .get()
    .then(getQuerySnapshotData)
    .then(data => {
      const filteredData = uniqWith((chat1, chat2) => {
        return (
          unavailableChats.includes(chat1.start) || chat1.start === chat2.start
        );
      }, data);

      // uniqWith does not check first value
      return unavailableChats.includes(filteredData[0]?.start)
        ? filteredData.splice(1)
        : filteredData;
    });
};

Chat.updateById = async ({ id, fields }) => {
  const lastUpdated = new Date().toISOString();
  return Firestore.collection(COLLECTION_CHATS)
    .doc(id)
    .update({ lastUpdated, ...fields })
    .then(() => ({ id, lastUpdated, ...fields }));
};

Chat.onConfirmation = async chat => {
  const { participant1Id, participant2Id } = chat;

  const participants = await Promise.all([
    User.byId(participant1Id),
    User.byId(participant2Id),
  ]);

  participants.forEach((participant, index) =>
    ChatBookedMessageHandler({
      message: {
        participant,
        chat,
        topics: participants[index ? 0 : 1]?.interests,
        otherParticipant: participants[index ? 0 : 1]?.displayName,
      },
    }),
  );
};

Chat.book = async ({ id, fields }) => {
  const link = await generateZoomLink(fields.start);
  const chat = await Chat.updateById({
    id,
    fields: { link, ...fields },
  });

  Chat.onConfirmation(chat);
  return chat;
};

Chat.onRequested = async chat => {
  const { participant1Id } = chat;
  const participant1 = await User.byId(participant1Id);
  const participant1Chat = await Chat.byParticipantIdWithStatusCondition({
    id: participant1Id,
    field: FIELD_PARTICIPANT_ONE,
    status: CHAT_STATUS_REQUESTED,
    condition: '==',
  });

  const requestsToday = participant1Chat.filter(
    chat =>
      new Date(chat.lastUpdated).toDateString() === new Date().toDateString(),
  ).length;

  // limit chat requested emails to 1 per day
  if (requestsToday <= 1)
    ChatRequestedMessageHandler({
      message: {
        participant: participant1,
        chat,
      },
    });
};

Chat.request = async ({ id, fields }) => {
  const chat = await Chat.updateById({
    id,
    fields,
  });

  Chat.onRequested(fields);
  return chat;
};

Chat.deleteById = id => Firestore.collection(COLLECTION_CHATS).doc(id).delete();

Chat.deleteByAvailabilityId = id =>
  Firestore.collection(COLLECTION_CHATS)
    .where('availabilityId', '==', id)
    .get()
    .then(querySnapshot => querySnapshot.forEach(doc => doc.ref.delete()));

export default Chat;
