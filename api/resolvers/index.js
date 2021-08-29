import Organization from '@api/resolvers/organization';
import Query from '@api/resolvers/queries';
import Mutation from '@api/resolvers/mutations';

const resolvers = {
  ...Organization,
  Query,
  Mutation,
};

export default resolvers;
