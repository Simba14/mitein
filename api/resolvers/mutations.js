import Sessions from '../firebase/sessions.js';
import { ValidationError } from '../auth/errors.js';
import { subscribeContactToNewsletter } from '../newsletter';
import { v4 as uuidv4 } from 'uuid';
// import { deleteUserToken } from "./auth/index.js";

export const deleteUserToken = expressResponse => {
  express.clearCookie(COOKIE_IDENTIFIER, COOKIE_OPTIONS);
};

const Mutation = {
  deleteSessions: (obj, { ids }, context, info) => {
    const deleteIds = ids.map(id => Sessions.deleteById(id));
    return Promise.all(deleteIds).then(() => true);
  },
  updateSession: async (
    parent,
    { sessionId, participant1Id, participant2Id, status, start, end },
    context,
    info,
  ) => {
    console.log({ sessionId, participant2Id, start, end, status });
    if (sessionId) {
      return Sessions.updateById({
        id: sessionId,
        fields: {
          ...(participant2Id ? { participant2Id } : {}),
          status,
        },
      });
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
