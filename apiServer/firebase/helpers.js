import { FirebaseGetDocError } from '@api/firebase/errors';
import { uniqWith } from 'lodash/fp';

export const getDocData = doc => {
  if (doc.exists) {
    return doc.data();
  } else {
    throw new FirebaseGetDocError('Document does not exist');
  }
};

export const getQuerySnapshotData = querySnapshot =>
  querySnapshot.docs.map(doc => doc.data());

export const filterAvailableChats = ({ chats, unavailableTimes }) => {
  const filteredChats = uniqWith(
    (chat1, chat2) =>
      unavailableTimes.includes(chat1.start) || chat1.start === chat2.start,
    chats,
  );

  // uniqWith does not check first value
  return unavailableTimes.includes(filteredChats[0]?.start)
    ? filteredChats.splice(1)
    : filteredChats;
};
