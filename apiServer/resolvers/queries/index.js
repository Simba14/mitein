import { sortBy } from 'lodash/fp';
import Availability from '@api/firebase/availability';
import Chat from '@api/firebase/chat';
import User from '@api/firebase/user';
import { Firestore } from '@api/firebase';

const Query = {
  user: async (parent, { id }) => {
    if (id) {
      return User.byIdWithAvailability(id);
    }
  },
  chats: async (
    parent,
    { participant1Id, participant2Id, status, notOneOf, upcoming },
  ) => {
    return Chat.byFilters({
      participant1Id,
      participant2Id,
      status,
      notOneOf,
      upcoming,
    });
  },
  availability: async (parent, { userId }) => {
    return await Availability.byUserId(userId);
  },
  availableSlots: async () => {
    return sortBy('start')(await Chat.getOnlyAvailable());
  },
  volunteerWith: async () => {
    const collection = await Firestore.collection('organizations').get();
    const coll = collection.docs.map(doc => doc.data());

    return coll;
  },
};

export default Query;
