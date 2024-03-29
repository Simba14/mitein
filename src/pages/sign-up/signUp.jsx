import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { useRouter } from 'next/router';
import classnames from 'classnames/bind';

import { compose, get } from 'lodash/fp';

import SIGN_UP from '@graphql/mutations/signUp.graphql';
import Form, { SIGN_UP_TYPE } from 'components/blocks/form';
import { sessionProps, withSessionContext } from 'context/session';
import { ROUTE_ONBOARDING, ROUTE_PROFILE } from 'routes';
import { withLayout } from 'components/blocks/layout';

import styles from './signUp.module.scss';
const cx = classnames.bind(styles);

const SignUp = ({ session }) => {
  const [error, setError] = useState(null);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const router = useRouter();

  const signUpSuccessful = data => {
    session.setUserLoggedIn(data.signUp.id);
    router.push(ROUTE_ONBOARDING);
  };

  const [signUp, { loading }] = useMutation(SIGN_UP, {
    onCompleted: signUpSuccessful,
  });

  const userId = get('userId', session);
  if (userId && !isSigningUp) {
    router.push(ROUTE_PROFILE);
    return null;
  }

  const onSignUp = ({ accountType, displayName, email, password }) => {
    setIsSigningUp(true);
    signUp({
      variables: { accountType, displayName, email, password },
    }).catch(e => {
      setError(get('graphQLErrors[0].message', e) || e.message);
      setIsSigningUp(false);
    });
  };

  const resetError = () => setError(null);

  return (
    <div className={cx('wrapper')}>
      <Form
        loadingSubmit={loading}
        onChange={resetError}
        onSubmit={onSignUp}
        submitError={error}
        type={SIGN_UP_TYPE}
      />
    </div>
  );
};

SignUp.propTypes = {
  session: sessionProps.isRequired,
};

export default compose(withLayout, withSessionContext)(SignUp);
