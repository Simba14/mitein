import React from 'react';
import { appWithTranslation } from 'next-i18next';
// import { ApolloProvider } from '@apollo/client';
import { Provider } from 'urql';

import { client } from 'apollo/client';
import { SessionContextProvider } from 'context/session';
import 'scss/main.scss';
import '@fullcalendar/common/main.css';
import '@fullcalendar/daygrid/main.css';
import '@fullcalendar/timegrid/main.css';
// import { ENGLISH } from 'constants/defaultOptions';

const cookieUserIdExpireDays = parseInt(
  process.env.NEXT_PUBLIC_COOKIE_USER_ID_EXPIRE_DAYS,
  10,
);
const cookieUserIdIdentifier =
  process.env.NEXT_PUBLIC_COOKIE_USER_ID_IDENTIFIER;

const SESSION = {
  cookieUserIdExpireDays,
  cookieUserIdIdentifier,
};

const Mitein = ({ Component, pageProps }) => (
  <Provider client={client}>
    <SessionContextProvider {...SESSION}>
      <Component {...pageProps} />
    </SessionContextProvider>
  </Provider>
);

export default appWithTranslation(Mitein);
