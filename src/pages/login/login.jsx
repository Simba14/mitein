import React from 'react';
import { Mutation } from '@apollo/react-components';
import { navigate } from 'gatsby';
import { compose } from 'lodash/fp';

import Form, { LOGIN_TYPE } from 'components/form';
import { ROUTE_PROFILE } from 'routes';
import { withLayout } from 'components/layout';
import { sessionProps, withSessionContext } from 'context/session';
import SIGN_IN from 'graphql/mutations/signIn.graphql';

import styles from './login.module.scss';

const SignIn = ({ session }) => {
  const signInSuccessful = (data) => {
    session.setUserLoggedIn(data.signIn.id);
    navigate(ROUTE_PROFILE);
  };

  return (
    <div className={styles.wrapper}>
      <Mutation mutation={SIGN_IN} onCompleted={signInSuccessful}>
        {(signUp, { loading }) => {
          const onLogin = ({ email, password }) =>
            signUp({ variables: { email, password } });

          return (
            <Form
              onSubmit={onLogin}
              type={LOGIN_TYPE}
              loadingSubmit={loading}
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
