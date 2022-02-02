import React, { createContext, useState } from 'react';
import { bool, func, node, number, shape, string } from 'prop-types';
import cookie from 'js-cookie';

export const sessionProps = shape({
  consentRecorded: bool,
  onConsentSelection: func,
  userId: string,
  userLoggedOut: func,
  setUserLoggedOut: func,
});

const SessionContext = createContext();

export const SessionContextProvider = ({
  children,
  cookieConsentRecordedIdentifier,
  cookieUserIdExpireDays,
  cookieUserIdIdentifier,
}) => {
  const getUserId = () => {
    const userIdCookie = cookie.get(cookieUserIdIdentifier);
    return typeof userIdCookie === 'string' ? userIdCookie : undefined;
  };

  const getConsentRecorded = () => {
    const consentRecordedCookie = cookie.get(cookieConsentRecordedIdentifier);
    return Boolean(consentRecordedCookie);
  };

  const [userId, setUserId] = useState(getUserId());
  const [consentRecorded, setConsentRecorded] = useState(getConsentRecorded);

  const setUserLoggedIn = id => {
    if (id) {
      setUserId(id);
      cookie.set(cookieUserIdIdentifier, id, {
        expires: cookieUserIdExpireDays,
      });
    } else {
      cookie.remove(cookieUserIdIdentifier);
    }
  };

  const userLoggedOut = () => {
    setUserLoggedIn(undefined);
    setUserId(undefined);
  };

  const onConsentSelection = () => {
    setConsentRecorded(true);
  };

  return (
    <SessionContext.Provider
      value={{
        session: {
          consentRecorded,
          userId,
          setUserLoggedIn,
          userLoggedOut,
          onConsentSelection,
        },
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};

SessionContextProvider.propTypes = {
  children: node.isRequired,
  cookieConsentRecordedIdentifier: string.isRequired,
  cookieUserIdExpireDays: number.isRequired,
  cookieUserIdIdentifier: string.isRequired,
};

const SessionContextConsumer = SessionContext.Consumer;

export const withSessionContext = WrappedComponent => {
  const SessionContext = props => (
    <SessionContextConsumer>
      {sessionContextConsumerProps => (
        <WrappedComponent {...props} {...sessionContextConsumerProps} />
      )}
    </SessionContextConsumer>
  );
  SessionContext.displayName = 'SessionContext';
  return SessionContext;
};
