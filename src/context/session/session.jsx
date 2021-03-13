import React, { createContext, useState } from 'react';
import { func, node, number, shape, string } from 'prop-types';
import cookie from 'js-cookie';

export const sessionProps = shape({
  userId: string,
  userLoggedOut: func,
  setUserLoggedOut: func,
});

const SessionContext = createContext();

export const SessionContextProvider = ({
  children,
  cookieUserIdExpireDays,
  cookieUserIdIdentifier,
}) => {
  const getUserId = () => {
    console.log('getUserId');
    // const [profile] = await cookie.get(cookieCustomerLoggedInIdentifier) === TRUE ? this.fetchProfile() : undefined;
    return cookie.get(cookieUserIdIdentifier) || undefined;
  };

  const [userId, setUserId] = useState(getUserId());
  console.log('sessiion', { userId });
  const setUserLoggedIn = (id) => {
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

  return (
    <SessionContext.Provider
      value={{ session: { userId, setUserLoggedIn, userLoggedOut } }}
    >
      {children}
    </SessionContext.Provider>
  );
};

SessionContextProvider.propTypes = {
  children: node.isRequired,
  cookieUserIdExpireDays: number.isRequired,
  cookieUserIdIdentifier: string.isRequired,
};

const SessionContextConsumer = SessionContext.Consumer;

export const withSessionContext = (WrappedComponent) => (props) => (
  <SessionContextConsumer>
    {(sessionContextConsumerProps) => (
      <WrappedComponent {...props} {...sessionContextConsumerProps} />
    )}
  </SessionContextConsumer>
);
