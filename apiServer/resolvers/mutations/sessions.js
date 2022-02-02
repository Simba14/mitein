import { get } from 'lodash/fp';
import { v4 as uuidv4 } from 'uuid';
import Availability from '@api/firebase/availability';
import Sessions from '@api/firebase/sessions';
import User from '@api/firebase/user';
import {
  EVENT_DURATION,
  SESSION_STATUS_BOOKED,
  SESSION_STATUS_REQUESTED,
} from '@api/firebase/constants';

const createSessions = async ({
  availabilityId,
  start,
  end,
  participant1Id,
  participant2Id,
  status,
}) => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const numberOfSessions = (endDate - startDate) / EVENT_DURATION;
  const sessions = [];

  for (let i = 0; i < numberOfSessions; i++) {
    const id = uuidv4();
    const session = await Sessions.create({
      id,
      session: {
        id,
        availabilityId,
        participant1Id,
        participant2Id: participant2Id || null,
        status,
        start: new Date(startDate.getTime() + i * EVENT_DURATION).toISOString(),
        end: new Date(
          startDate.getTime() + (i + 1) * EVENT_DURATION,
        ).toISOString(),
        cancellationReason: null,
      },
    });

    sessions.push(session);
  }

  return sessions;
};

const SessionsMutation = {
  createSessionsFromAvailability: async (
    parent,
    { participant1Id, participant2Id, status, start, end, userType },
    context,
    info,
  ) => {
    const id = uuidv4();
    const availability = await Availability.create({
      id,
      fields: {
        id,
        start,
        end,
        userId: participant1Id,
        userType,
      },
    });

    await createSessions({
      availabilityId: availability.id,
      participant1Id,
      participant2Id,
      status,
      start,
      end,
    });

    return availability;
  },
  deleteSessions: async (obj, { ids }, context, info) => {
    const deleteActions = ids.map(
      id =>
        new Promise(async (res, rej) => {
          try {
            await Sessions.deleteByAvailabilityId(id);
            await Availability.deleteById(id);
            res();
          } catch (error) {
            rej(error);
          }
        }),
    );

    return Promise.all(deleteActions).then(() => true);
  },
  updateSession: async (parent, { id, ...fields }, context, info) => {
    const { cancellationReason, cancelledBy, participant2Id, status } = fields;
    if (id) {
      if (status === SESSION_STATUS_BOOKED) {
        const bookedSession = await Sessions.book({
          id,
          fields,
        });

        return bookedSession;
      }

      if (status === SESSION_STATUS_REQUESTED) {
        const existingSession = await Sessions.byId(id);
        const existingParticipant2 = get('participant2Id', existingSession);

        if (existingParticipant2 && existingParticipant2 !== participant2Id)
          throw new Error('Session no longer available. Please try again.');

        const requestedSession = await Sessions.request({
          id,
          fields,
        });
        return requestedSession;
      }

      const session = await Sessions.updateById({
        id,
        fields: {
          ...fields,
        },
      });

      if (cancellationReason && cancelledBy) {
        await User.updateCancellations({
          sessionId: id,
          userId: cancelledBy,
        });
      }

      return session;
    } else {
      const newId = uuidv4();
      return Sessions.create({
        id: newId,
        session: {
          id: newId,
          ...fields,
        },
      });
    }
  },
};

export default SessionsMutation;
