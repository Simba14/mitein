import Availability from '@api/firebase/availability';
import Chat from '@api/firebase/chat';
import User from '@api/firebase/user';
import Organization from '@api/firebase/organization';

const Query = {
  user: async (parent, { id }) => {
    if (id) {
      return User.byIdWithChats(id);
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
  availableChats: async (parent, { userId }) => {
    return await Chat.getOnlyAvailable({ participant1Id: userId });
  },
  organization: async (parent, { id, userId }) => {
    if (userId) return await Organization.byUserId(userId);
    return await Organization.byId(id);
  },
  volunteerWith: async () => {
    return await Organization.byVolunteerWith();
  },
};

export default Query;
