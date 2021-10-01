import React from 'react';
import { useTranslation } from 'next-i18next';
import { get } from 'lodash/fp';
import { useQuery } from '@apollo/client';
import classnames from 'classnames/bind';

import Anchor from 'components/anchor';
import { ROUTE_LOGIN, ROUTE_PROFILE, ROUTE_SIGN_UP } from 'routes';
import { sessionProps, withSessionContext } from 'context/session';
import GET_EMAIL from '@graphql/queries/getEmail.graphql';
import AccountIcon from 'assets/account.svg';

import styles from './accountSection.module.scss';
const cx = classnames.bind(styles);

const AccountSection = ({ session }) => {
  const { t } = useTranslation('common');
  const userId = get('userId', session);
  const { data, loading } = useQuery(GET_EMAIL, {
    variables: { id: userId },
    skip: !userId,
  });

  const NotLoggedInComponent = () => (
    <>
      <Anchor className={cx('accountLink', 'signUp')} to={ROUTE_SIGN_UP}>
        <span className={cx('signUpText')}>{t('signUp')}</span>
        <AccountIcon className={cx('accountIcon')} />
      </Anchor>
      <Anchor className={cx('login')} to={ROUTE_LOGIN}>
        {t('login')}
      </Anchor>
    </>
  );

  const LoggedInComponent = () => {
    return loading ? null : (
      <Anchor className={cx('accountLink')} to={ROUTE_PROFILE}>
        <AccountIcon className={cx('accountIcon')} />
        <span className={cx('email')}>{email}</span>
      </Anchor>
    );
  };

  const email = get('user.email', data);

  return (
    <div className={cx('accountContainer')}>
      {email || loading ? <LoggedInComponent /> : <NotLoggedInComponent />}
    </div>
  );
};

AccountSection.propTypes = {
  session: sessionProps.isRequired,
};

export default withSessionContext(AccountSection);
