import { sortBy } from 'lodash/fp';
import Sessions from '../firebase/sessions.js';
import User from '../firebase/user.js';
import { Firestore } from '../firebase/index.js';
// import { ValidationError } from './auth/errors.js';
// import { v4 as uuidv4 } from 'uuid';

// const getAvailability = ({ event_id, user_id, start, end }) => {
//   return Availability.create({ id: uuidv4(), user_id, start, end });
// };

const getUser = id => {
  return User.byIdWithAvailability(id);
};

const Query = {
  user: async (obj, { id }, context, info) => {
    if (id) {
      console.log(await User.byIdWithAvailability(id));
      return User.byIdWithAvailability(id);
    }
  },
  sessions: async (
    obj,
    { participant1Id, participant2Id, status },
    context,
    info,
  ) => {
    return Sessions.byFilters({ participant1Id, participant2Id, status });
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
