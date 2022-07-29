import React, { useEffect, useState } from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { string } from 'prop-types';
import classnames from 'classnames/bind';
import { useMutation } from '@apollo/client';
import { compose, get } from 'lodash/fp';
import { useTranslation } from 'next-i18next';

import Cta from 'components/atoms/cta';
import Loading from 'components/atoms/loading';
import Text, { HEADING_4 } from 'components/atoms/text';
import { withLayout } from 'components/blocks/layout';
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
        'common',
        'menu',
        'verifyEmail',
      ])),
      tokenValue,
    },
  };
};

const VerifyEmail = ({ tokenValue }) => {
  const { t } = useTranslation('verifyEmail');
  const [loading, setLoading] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);

  const [confirmEmail] = useMutation(VERIFY_EMAIL);

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

  if (loading) return <Loading />;

  return tokenValid ? (
    <div className={cx('wrapper')}>
      <Text className={cx('heading')} tag="h3" type={HEADING_4}>
        {t('emailVerified')}
      </Text>
      <Text className={cx('description')}>{t('featuresEnabled')}</Text>
      <Cta to={ROUTE_PROFILE} className={cx('cta')} text={t('redirect')} />
    </div>
  ) : (
    <div className={cx('wrapper')}>
      <Text className={cx('heading')} tag="h3" type={HEADING_4}>
        {t('invalidToken.title')}
      </Text>
      <Text className={cx('description')}>{t('invalidToken.description')}</Text>
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
