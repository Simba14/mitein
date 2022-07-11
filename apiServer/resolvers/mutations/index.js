import Availability from './availability';
import Chats from './chats';
import Users from './users';

const Mutation = {
  ...Availability,
  ...Chats,
  ...Users,
};

export default Mutation;
