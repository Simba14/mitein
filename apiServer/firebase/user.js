import firebase from 'firebase/app';
import { v4 as uuidv4 } from 'uuid';
import { isEmpty } from 'lodash/fp';
import { Firestore } from '@api/firebase';
import Chats from '@api/firebase/chat';
import { getDocData, getQuerySnapshotData } from '@api/firebase/helpers';
import {
  COLLECTION_USERS,
  USER_TYPE_LEARNER,
  FIELD_PARTICIPANT_ONE,
  FIELD_PARTICIPANT_TWO,
  MAX_NUMBER_OF_CANCELLATIONS,
  SUSPENSION_DURATION,
  CHAT_STATUS_BOOKED,
  CHAT_STATUS_REQUESTED,
  CHAT_STATUS_REJECTED,
} from '@api/firebase/constants';
import {
  FirebaseCreateDocError,
  FirebaseGetDocError,
} from '@api/firebase/errors';

const User = {};

User.create = async ({ id, user }) =>
  Firestore.collection(COLLECTION_USERS)
    .doc(id)
    .set(user)
    .catch(() => {
      throw new FirebaseCreateDocError('Creation of User doc failed');
    });

User.byId = async id =>
  Firestore.collection(COLLECTION_USERS).doc(id).get().then(getDocData);

User.byIdWithAvailability = async id => {
  const user = await Firestore.collection(COLLECTION_USERS)
    .doc(id)
    .get()
    .then(getDocData)
    .catch(() => {
      throw new FirebaseGetDocError('Could not return user');
    });

  const participantField =
    user.type === USER_TYPE_LEARNER
      ? FIELD_PARTICIPANT_TWO
      : FIELD_PARTICIPANT_ONE;

  const allChats =
    (await Chats.byParticipantId({
      field: participantField,
      id,
    })) || [];

  const dateConstraint = new Date();
  dateConstraint.setTime(dateConstraint.getTime() - 60 * 60 * 1000); // set 1 hour into past

  const [booked, requested, rejected] = allChats.reduce(
    ([bookings, requests, rejections], chat) => {
      // only include upcoming chats
      if (chat.start < dateConstraint.toISOString())
        return [bookings, requests, rejections];
      if (chat.status === CHAT_STATUS_BOOKED)
        return [[...bookings, chat], requests, rejections];
      if (chat.status === CHAT_STATUS_REQUESTED)
        return [bookings, [...requests, chat], rejections];
      if (chat.status === CHAT_STATUS_REJECTED)
        return [bookings, requests, [...rejections, chat]];

      return [bookings, requests, rejections];
    },
    [[], [], []],
  );

  return {
    ...user,
    chats: {
      booked: isEmpty(booked) ? null : booked,
      requested: isEmpty(requested) ? null : requested,
      rejected: isEmpty(rejected) ? null : rejected,
    },
  };
};

User.byEmail = async email =>
  Firestore.collection(COLLECTION_USERS)
    .where('email', '==', email)
    .get()
    .then(getQuerySnapshotData)
    .then(users => users[0]);

User.updateById = ({ id, fields }) =>
  Firestore.collection(COLLECTION_USERS)
    .doc(id)
    .update(fields)
    .then(() => ({ id, ...fields }));

User.updateCancellations = async ({ chatId, userId }) => {
  const { cancellations } = await User.byId(userId);
  const dateConstraint = new Date(Date.now() - SUSPENSION_DURATION);

  const recentCancellations =
    !isEmpty(cancellations) &&
    cancellations.filter(item => item.date > dateConstraint.toISOString());

  const suspendedUntil =
    !isEmpty(recentCancellations) &&
    recentCancellations.length >= MAX_NUMBER_OF_CANCELLATIONS
      ? new Date(Date.now() + SUSPENSION_DURATION).toISOString()
      : null;

  const newCancellation = {
    id: uuidv4(),
    chatId,
    date: new Date().toISOString(),
  };

  await User.updateById({
    id: userId,
    fields: {
      cancellations: firebase.firestore.FieldValue.arrayUnion(newCancellation),
      suspendedUntil,
    },
  });

  return suspendedUntil;
};

User.deleteById = async id =>
  Firestore.collection(COLLECTION_USERS).doc(id).delete();

export default User;
