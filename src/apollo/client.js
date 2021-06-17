// import { ApolloClient, InMemoryCache } from '@apollo/client';
// import fetch from 'isomorphic-fetch';

// export const client = new ApolloClient({
//   uri: process.env.NEXT_PUBLIC_API_URL,
//   cache: new InMemoryCache(),
//   fetch,
// });

import { createClient } from 'urql';

export const client = createClient({
  url: process.env.NEXT_PUBLIC_API_URL,
});
