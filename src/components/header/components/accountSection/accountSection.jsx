import React from 'react';
import { useTranslation } from 'next-i18next';
import { get } from 'lodash/fp';
import { Query } from '@apollo/client/react/components';

import Anchor from 'components/anchor';
import { ROUTE_LOGIN, ROUTE_PROFILE, ROUTE_SIGN_UP } from 'routes';
import { sessionProps, withSessionContext } from 'context/session';
import GET_EMAIL from '@graphql/queries/getEmail.graphql';
import AccountIcon from 'assets/account.svg';

import styles from './accountSection.module.scss';

const AccountSection = ({ session }) => {
  const { t } = useTranslation('header');
  const userId = get('userId', session);

  const NotLoggedInComponent = () => (
    <>
      <Anchor className={styles.signUp} to={ROUTE_SIGN_UP}>
        <span className={styles.signUpText}>{t('signUp')}</span>
        <AccountIcon className={styles.accountIcon} />
      </Anchor>
      <Anchor className={styles.login} to={ROUTE_LOGIN}>
        {t('login')}
      </Anchor>
    </>
  );

  return (
    <div className={styles.accountContainer}>
      {userId ? (
        <Query query={GET_EMAIL} variables={{ id: userId }}>
          {({ data, loading, error }) => {
            const email = get('user.email', data);
            if (loading || error || !email) return <NotLoggedInComponent />;
            if (error) return <NotLoggedInComponent />;

            return (
              <Anchor className={styles.profile} to={ROUTE_PROFILE}>
                <AccountIcon className={styles.accountIcon} />
                <span className={styles.email}>{email}</span>
              </Anchor>
            );
          }}
        </Query>
      ) : (
        <NotLoggedInComponent />
      )}
    </div>
  );
};

AccountSection.propTypes = {
  session: sessionProps.isRequired,
};

export default withSessionContext(AccountSection);
