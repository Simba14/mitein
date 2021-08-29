import { ApolloServer } from 'apollo-server-micro';

import config from '@api/config';
import ErrorFormatterPlugin from '@api/plugins/error-formatter-plugin';
import { Auth } from '@api/auth/index';
import resolvers from '@api/resolvers/index';
import typeDefs from '@api/schema/typeDefs';
import PubSub from '@api/pubsub';

const {
  apollo: { introspection, enablePlayground },
} = config;

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: introspection,
  playground: enablePlayground,
  context: ({ req, res }) => {
    return {
      auth: Auth(),
      req,
      res,
    };
  },
  plugins: [ErrorFormatterPlugin()],
});

const pubsub = PubSub();
pubsub.init();

export default server;
