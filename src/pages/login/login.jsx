import React, { useCallback, useState } from 'react';
import { useMutation } from '@apollo/client';
import { useRouter } from 'next/router';
import { compose, get } from 'lodash/fp';

import Form, { LOGIN_TYPE } from 'components/form';
import { ROUTE_PROFILE } from 'routes';
import { withLayout } from 'components/layout';
import { sessionProps, withSessionContext } from 'context/session';
import SIGN_IN from '@graphql/mutations/signIn.graphql';

import styles from './login.module.scss';

const SignIn = ({ session }) => {
  const [error, setError] = useState(null);
  const router = useRouter();

  const signInSuccessful = data => {
    session.setUserLoggedIn(data.signIn.id);
    router.push(ROUTE_PROFILE);
  };

  const [signIn, { loading }] = useMutation(SIGN_IN, {
    onCompleted: signInSuccessful,
  });

  const onLogin = useCallback(
    ({ email, password }) =>
      signIn({ variables: { email, password } }).catch(e => {
        setError(get('graphQLErrors[0].message', e) || e.message);
      }),
    [signIn, setError],
  );

  const resetError = useCallback(() => setError(null), [setError]);

  const userId = get('userId', session);
  if (userId) {
    router.push(ROUTE_PROFILE);
    return null;
  }

  return (
    <div className={styles.wrapper}>
      <Form
        loadingSubmit={loading}
        onSubmit={onLogin}
        submitError={error}
        onChange={resetError}
        type={LOGIN_TYPE}
      />
    </div>
  );
};

SignIn.propTypes = {
  session: sessionProps.isRequired,
};

export default compose(withLayout, withSessionContext)(SignIn);
