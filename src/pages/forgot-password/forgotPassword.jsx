import React, { useCallback, useState } from 'react';
import { useMutation } from '@apollo/client';
import { useRouter } from 'next/router';
import { compose, get } from 'lodash/fp';

import Form, { FORGOT_PASSWORD } from 'components/form';
import { ROUTE_PROFILE } from 'routes';
import { withLayout } from 'components/layout';
import { sessionProps, withSessionContext } from 'context/session';
import RESET_PASSWORD_REQUEST from '@graphql/mutations/resetPasswordRequest.graphql';

import styles from './forgotPassword.module.scss';

const ForgotPassword = ({ session }) => {
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(null);
  const router = useRouter();

  const [passwordForgotten, { loading }] = useMutation(RESET_PASSWORD_REQUEST, {
    onCompleted: () => setSubmitted(true),
  });

  const onSubmit = useCallback(
    ({ email }) =>
      passwordForgotten({ variables: { email } }).catch(e => {
        setError(get('graphQLErrors[0].message', e) || e.message);
      }),
    [passwordForgotten, setError],
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
        displaySuccessMsg={submitted}
        loadingSubmit={loading}
        onSubmit={onSubmit}
        submitError={error}
        onChange={resetError}
        type={FORGOT_PASSWORD}
      />
    </div>
  );
};

ForgotPassword.propTypes = {
  session: sessionProps.isRequired,
};

export default compose(withLayout, withSessionContext)(ForgotPassword);
