import React from 'react';
import { ApolloProvider } from '@apollo/client';
import { I18nextProvider } from 'react-i18next';

import i18n from 'i18n.js';
import { client } from 'apollo/client';
import { SessionContextProvider } from 'context/session';
import { PageContext } from 'context/page';

const cookieUserIdExpireDays = parseInt(
  process.env.COOKIE_USER_ID_EXPIRE_DAYS,
  10,
);
const cookieUserIdIdentifier = process.env.COOKIE_USER_ID_IDENTIFIER;

const SESSION = {
  cookieUserIdExpireDays,
  cookieUserIdIdentifier,
};

export const wrapRootElement = ({ element }) => {
  return (
    <ApolloProvider client={client}>
      <I18nextProvider i18n={i18n}>
        <SessionContextProvider {...SESSION}>{element}</SessionContextProvider>
      </I18nextProvider>
    </ApolloProvider>
  );
};

export const wrapPageElement = ({ element, props }) => {
  i18n.changeLanguage(props.pageContext.lang || 'en');

  return (
    <PageContext.Provider value={props.pageContext}>
      {element}
    </PageContext.Provider>
  );
};
