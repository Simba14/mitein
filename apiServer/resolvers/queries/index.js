import { sortBy } from 'lodash/fp';
import Availability from '@api/firebase/availability';
import Sessions from '@api/firebase/sessions';
import User from '@api/firebase/user';
import { Firestore } from '@api/firebase';

const Query = {
  user: async (obj, { id }, context, info) => {
    if (id) {
      return User.byIdWithAvailability(id);
    }
  },
  sessions: async (
    obj,
    { participant1Id, participant2Id, status, notOneOf },
    context,
    info,
  ) => {
    return Sessions.byFilters({
      participant1Id,
      participant2Id,
      status,
      notOneOf,
    });
  },
  availability: async (obj, { userId }, context, info) => {
    return await Availability.byUserId(userId);
  },
  availableSlots: async (obj, args, context, info) => {
    return sortBy('start')(await Sessions.getOnlyAvailable());
  },
  volunteerWith: async (obj, args, context, info) => {
    const collection = await Firestore.collection('organizations').get();
    const coll = collection.docs.map(doc => doc.data());

    return coll;
  },
};

export default Query;
