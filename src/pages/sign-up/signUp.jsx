import React from 'react';
import { navigate } from 'gatsby';
import { Mutation } from '@apollo/client/react/components';
import { compose, get } from 'lodash/fp';

import SIGN_UP from 'graphql/mutations/signUp.graphql';
import Form, { SIGN_UP_TYPE } from 'components/form';
import { sessionProps, withSessionContext } from 'context/session';
import { ROUTE_PROFILE } from 'routes';
import { withLayout } from 'components/layout';
import styles from './signUp.module.scss';

const SignUp = ({ session }) => {
  const userId = get('userId', session);
  if (userId) {
    navigate(ROUTE_PROFILE);
    return null;
  }

  const signUpSuccessful = (data) => {
    session.setUserLoggedIn(data.signUp.id);
    navigate(ROUTE_PROFILE);
  };

  return (
    <div className={styles.wrapper}>
      <Mutation mutation={SIGN_UP} onCompleted={signUpSuccessful}>
        {(signUp, { loading }) => {
          const onSignUp = ({ accountType, email, password }) => {
            signUp({ variables: { accountType, email, password } });
          };

          return (
            <Form
              onSubmit={onSignUp}
              type={SIGN_UP_TYPE}
              loadingSubmit={loading}
            />
          );
        }}
      </Mutation>
    </div>
  );
};

SignUp.propTypes = {
  session: sessionProps.isRequired,
};

export default compose(withLayout, withSessionContext)(SignUp);
