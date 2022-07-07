import { sortBy } from 'lodash/fp';
import Availability from '@api/firebase/availability';
import Sessions from '@api/firebase/sessions';
import User from '@api/firebase/user';
import { Firestore } from '@api/firebase';

const Query = {
  user: async (parent, { id }) => {
    if (id) {
      return User.byIdWithAvailability(id);
    }
  },
  sessions: async (
    parent,
    { participant1Id, participant2Id, status, notOneOf, upcoming },
  ) => {
    return Sessions.byFilters({
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
    return sortBy('start')(await Sessions.getOnlyAvailable());
  },
  volunteerWith: async () => {
    const collection = await Firestore.collection('organizations').get();
    const coll = collection.docs.map(doc => doc.data());

    return coll;
  },
};

export default Query;
