import Organization from './organization.js';
import Query from './queries.js';
import Mutation from './mutations.js';

const resolvers = {
  ...Organization,
  Query,
  Mutation,
};

export default resolvers;
