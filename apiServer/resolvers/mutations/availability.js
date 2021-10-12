import { v4 as uuidv4 } from 'uuid';
import Availability from '@api/firebase/availability';

const SessionsMutation = {
  addAvailability: async (parent, { start, end, userId }, context, info) => {
    const id = uuidv4();
    const availability = await Availability.create({
      id,
      fields: {
        id,
        start,
        end,
        userId,
      },
    });

    return availability;
  },
  deleteAvailability: (obj, { ids }, context, info) => {
    const deleteIds = ids.map(id => Availability.deleteById(id));
    return Promise.all(deleteIds).then(() => true);
  },
};

export default SessionsMutation;
