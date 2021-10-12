import Availability from './availability';
import Sessions from './sessions';
import Users from './users';

const Mutation = {
  ...Availability,
  ...Sessions,
  ...Users,
};

export default Mutation;
