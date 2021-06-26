import { isNull } from 'lodash/fp';
import { v4 as uuidv4 } from 'uuid';
import Sessions from '../firebase/sessions.js';
import User from '../firebase/user.js';
import { ValidationError } from '../auth/errors.js';
import { subscribeContactToNewsletter } from '../newsletter';
// import { deleteUserToken } from "./auth/index.js";

export const deleteUserToken = (expressResponse) => {
  express.clearCookie(COOKIE_IDENTIFIER, COOKIE_OPTIONS);
};

const Mutation = {
  createSessions: async (
    parent,
    { participant1Id, participant2Id, status, start, end },
    context,
    info,
  ) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const eventDuration = 1800000; // 30 minutes in milliseconds;
    const numberOfSessions = (endDate - startDate) / eventDuration;
    const sessions = [];

    for (let i = 0; i < numberOfSessions; i++) {
      const id = uuidv4();
      const session = await Sessions.create({
        id,
        session: {
          id,
          participant1Id,
          participant2Id: participant2Id || null,
          status,
          start: new Date(
            startDate.getTime() + i * eventDuration,
          ).toISOString(),
          end: new Date(
            startDate.getTime() + (i + 1) * eventDuration,
          ).toISOString(),
          cancellationReason: null,
        },
      });

      sessions.push(session);
    }

    return sessions;
  },
  deleteSessions: (obj, { ids }, context, info) => {
    const deleteIds = ids.map((id) => Sessions.deleteById(id));
    return Promise.all(deleteIds).then(() => true);
  },
  updateSession: async (
    parent,
    {
      sessionId,
      participant1Id,
      participant2Id,
      status,
      start,
      end,
      cancelledBy,
      cancellationReason,
    },
    context,
    info,
  ) => {
    if (sessionId) {
      const session = await Sessions.updateById({
        id: sessionId,
        fields: {
          ...(participant2Id || isNull(participant2Id)
            ? { participant2Id }
            : {}),
          ...(cancellationReason ? { cancellationReason } : {}),
          status,
        },
      });

      if (cancellationReason && cancelledBy) {
        await User.updateCancellations({
          sessionId,
          userId: cancelledBy,
        });
      }

      return session;
    } else {
      const id = uuidv4();
      return Sessions.create({
        id,
        session: {
          id,
          participant1Id,
          participant2Id: participant2Id || null,
          status,
          start,
          end,
          cancellationReason: null,
        },
      });
    }
  },
  signIn: async (obj, args, context, info) => {
    const user = await context.auth.signIn(args);
    console.log({ user });
    if (user) {
      // res.set("x-user-id", user.id);
      // res.set("x-customer-id", user.customerId);
      return user;
    } else {
      throw new ValidationError('Incorrect login details');
    }
  },
  signOut: async (parent, args, context, info) => {
    return context.auth.signOut();
    // deleteUserToken(expressResponse);
  },
  signUp: async (obj, args, context, info) => {
    const user = await context.auth.signUp(args);
    return user;
  },
  newsletterSignUp: async (obj, args, context, info) => {
    const { email } = args;
    await subscribeContactToNewsletter(email);
    return email;
  },
};

export default Mutation;
