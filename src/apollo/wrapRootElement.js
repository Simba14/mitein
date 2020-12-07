import React from 'react';
import { ApolloProvider } from '@apollo/react-hooks';

import { client } from './client';
import { SessionContextProvider } from 'context/session';

const cookieUserIdExpireDays = parseInt(
  process.env.COOKIE_USER_ID_EXPIRE_DAYS,
  10,
);
const cookieUserIdIdentifier = process.env.COOKIE_USER_ID_IDENTIFIER;

const SESSION = {
  cookieUserIdExpireDays,
  cookieUserIdIdentifier,
};

export const wrapRootElement = ({ element }) => (
  <ApolloProvider client={client}>
    <SessionContextProvider {...SESSION}>{element}</SessionContextProvider>
  </ApolloProvider>
);
