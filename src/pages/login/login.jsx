import React from 'react';
import { Mutation } from '@apollo/client/react/components';
import { navigate } from 'gatsby';
import { compose, get } from 'lodash/fp';

import Form, { LOGIN_TYPE } from 'components/form';
import { ROUTE_PROFILE } from 'routes';
import { withLayout } from 'components/layout';
import { sessionProps, withSessionContext } from 'context/session';
import SIGN_IN from 'graphql/mutations/signIn.graphql';

import styles from './login.module.scss';

const SignIn = ({ session }) => {
  const userId = get('userId', session);
  if (userId) {
    navigate(ROUTE_PROFILE);
    return null;
  }

  const signInSuccessful = (data) => {
    session.setUserLoggedIn(data.signIn.id);
    navigate(ROUTE_PROFILE);
  };

  return (
    <div className={styles.wrapper}>
      <Mutation mutation={SIGN_IN} onCompleted={signInSuccessful}>
        {(signUp, { loading, error }) => {
          const onLogin = ({ email, password }) =>
            signUp({ variables: { email, password } });

          return (
            <Form
              loadingSubmit={loading}
              onSubmit={onLogin}
              submitError={error}
              type={LOGIN_TYPE}
            />
          );
        }}
      </Mutation>
    </div>
  );
};

SignIn.propTypes = {
  session: sessionProps.isRequired,
};

export default compose(withLayout, withSessionContext)(SignIn);
