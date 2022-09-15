import React from 'react';
import { appWithTranslation } from 'next-i18next';
import { ApolloProvider } from '@apollo/client';
import { ToastContainer, toast, Slide } from 'react-toastify';

import { client } from 'apollo/client';
import { SessionContextProvider } from 'context/session';
import ErrorBoundary from 'components/blocks/errorBoundary';
import '@fullcalendar/common/main.css';
import '@fullcalendar/daygrid/main.css';
import '@fullcalendar/timegrid/main.css';
import 'react-toastify/dist/ReactToastify.css';
import 'scss/main.scss';
import 'scss/toast.scss';
import { any, elementType } from 'prop-types';

const cookieConsentRecordedIdentifier =
  process.env.NEXT_PUBLIC_COOKIE_CONSENT_RECORDED_IDENTIFIER;

const cookieUserIdExpireDays = parseInt(
  process.env.NEXT_PUBLIC_COOKIE_USER_ID_EXPIRE_DAYS,
  10,
);
const cookieUserIdIdentifier =
  process.env.NEXT_PUBLIC_COOKIE_USER_ID_IDENTIFIER;

const SESSION = {
  cookieConsentRecordedIdentifier,
  cookieUserIdExpireDays,
  cookieUserIdIdentifier,
};

const Mitein = ({ Component, pageProps }) => (
  <ApolloProvider client={client}>
    <SessionContextProvider {...SESSION}>
      <ErrorBoundary>
        <Component {...pageProps} />
        <ToastContainer
          autoClose={false}
          position={toast.POSITION.TOP_LEFT}
          hideProgressBar
          transition={Slide}
        />
      </ErrorBoundary>
    </SessionContextProvider>
  </ApolloProvider>
);

Mitein.propTypes = {
  Component: elementType,
  pageProps: any,
};

export default appWithTranslation(Mitein);
