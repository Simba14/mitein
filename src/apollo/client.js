import { ApolloClient, InMemoryCache } from '@apollo/client';
import fetch from 'isomorphic-fetch';

export const client = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_API_URL,
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          sessions: {
            merge(existing, incoming) {
              return incoming;
            },
          },
        },
      },
    },
  }),
  fetch,
});
