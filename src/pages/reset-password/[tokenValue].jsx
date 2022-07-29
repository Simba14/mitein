import React, { useCallback, useState } from 'react';
import { useMutation } from '@apollo/client';
import { get } from 'lodash/fp';
import { useTranslation } from 'next-i18next';
import classnames from 'classnames/bind';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import Form, { RESET_PASSWORD } from 'components/blocks/form';
import Text, { HEADING_3 } from 'components/atoms/text';
import { ROUTE_LOGIN } from 'routes';
import { withLayout } from 'components/blocks/layout';
import RESET_PASSWORD_MUTATION from '@graphql/mutations/resetPassword.graphql';

import styles from './resetPassword.module.scss';
import { string } from 'prop-types';
const cx = classnames.bind(styles);

export const getServerSideProps = async ({ locale, params }) => {
  const tokenValue = get('tokenValue', params);
  if (!tokenValue) {
    return {
      redirect: {
        destination: ROUTE_LOGIN,
        permanent: false,
      },
    };
  }
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'menu', 'form'])),
      tokenValue,
    },
  };
};

const ResetPassword = ({ tokenValue }) => {
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(null);

  const { t } = useTranslation('form', { keyPrefix: 'resetPassword' });

  const [resetPassword, { loading }] = useMutation(RESET_PASSWORD_MUTATION, {
    onCompleted: () => setSubmitted(true),
  });

  const onSubmit = useCallback(
    ({ password }) =>
      resetPassword({ variables: { password, token: tokenValue } }).catch(e => {
        setError(get('graphQLErrors[0].message', e) || e.message);
      }),
    [resetPassword, setError],
  );

  const resetError = useCallback(() => setError(null), [setError]);

  return (
    <div className={cx('wrapper')}>
      <Text className={cx('title')} type={HEADING_3}>
        {t('title')}
      </Text>
      <Text className={cx('description')}>{t('description')}</Text>
      <Form
        displaySuccessMsg={submitted}
        loadingSubmit={loading}
        onSubmit={onSubmit}
        submitError={error}
        onChange={resetError}
        type={RESET_PASSWORD}
      />
    </div>
  );
};

ResetPassword.propTypes = {
  tokenValue: string,
};

export default withLayout(ResetPassword);
