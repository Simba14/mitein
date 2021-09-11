import React, { useEffect, useState } from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { string } from 'prop-types';
import classnames from 'classnames/bind';
import { useRouter } from 'next/router';
import { useQuery, useMutation } from '@apollo/client';
import { compose, get } from 'lodash/fp';
import { useTranslation } from 'next-i18next';

import Cta from 'components/cta';
import { withLayout } from 'components/layout';
import VERIFY_EMAIL from '@graphql/mutations/verifyEmail.graphql';
// import { sessionProps, withSessionContext } from 'context/session';
import { ROUTE_PROFILE, ROUTE_LOGIN } from 'routes';

import styles from './verifyEmail.module.scss';
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
      ...(await serverSideTranslations(locale, [
        'verifyEmail',
        'header',
        'menu',
      ])),
      tokenValue,
    },
  };
};

const VerifyEmail = ({ tokenValue }) => {
  const { t } = useTranslation('verifyEmail');
  // const router = useRouter();
  // const tokenValue = get('query.tokenValue', router);
  const [loading, setLoading] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);

  const [confirmEmail] = useMutation(VERIFY_EMAIL);

  // const {
  //   user: { sessions, displayName, email, suspendedUntil, type },
  // } = data;

  useEffect(() => {
    confirmEmail({
      variables: {
        tokenValue,
      },
    })
      .then(() => {
        setLoading(false);
        setTokenValid(true);
      })
      .catch(() => {
        setTokenValid(false);
        setLoading(false);
      });
  }, []);

  if (loading) return 'Loading';

  return tokenValid ? (
    <div className={cx('wrapper')}>
      <h3 className={cx('heading')}>{t('emailVerified')}</h3>
      <div className={cx('description')}>{t('featuresEnabled')}</div>
      <Cta to={ROUTE_PROFILE} className={cx('cta')} text={t('redirect')} />
    </div>
  ) : (
    <div className={cx('wrapper')}>
      <h3 className={cx('heading')}>{t('invalidToken.title')}</h3>
      <div className={cx('description')}>{t('invalidToken.description')}</div>
      <Cta className={cx('cta')} onClick={null} text={t('invalidToken.cta')} />
    </div>
  );
};

VerifyEmail.propTypes = {
  // session: sessionProps,
  tokenValue: string,
};

export { VerifyEmail };
export default compose(withLayout)(VerifyEmail);
