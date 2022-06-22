import { v4 as uuidv4 } from 'uuid';
import Availability from '@api/firebase/availability';

const SessionsMutation = {
  addAvailability: async (parent, { start, end, userId, userType }) => {
    const id = uuidv4();
    const dayIndex = new Date(start).getDay();

    const availability = await Availability.create({
      id,
      fields: {
        id,
        dayIndex,
        start,
        end,
        userId,
        userType,
      },
    });

    return availability;
  },
  deleteAvailability: (parent, { ids }) => {
    const deleteIds = ids.map(id => Availability.deleteById(id));
    return Promise.all(deleteIds).then(() => true);
  },
};

export default SessionsMutation;
