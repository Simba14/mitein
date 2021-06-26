import { sortBy } from 'lodash/fp';
import Sessions from '../firebase/sessions.js';
import User from '../firebase/user.js';
import { Firestore } from '../firebase/index.js';

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
  availableSlots: async (obj, args, context, info) => {
    return sortBy('start')(await Sessions.getOnlyAvailable());
  },
  volunteerWith: async (obj, args, context, info) => {
    const collection = await Firestore.collection('organizations').get();
    const coll = collection.docs.map((doc) => doc.data());

    return coll;
  },
};

export default Query;
