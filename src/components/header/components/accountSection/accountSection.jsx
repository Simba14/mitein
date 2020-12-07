import React from 'react';
// import Svg, { LOGO } from '../svg/';
import { Link } from 'gatsby';
import { useTranslation } from 'react-i18next';
import { get } from 'lodash/fp';
import { Query } from '@apollo/react-components';

import { ROUTE_LOGIN, ROUTE_PROFILE, ROUTE_SIGN_UP } from 'routes';
import { sessionProps, withSessionContext } from 'context/session';
import GET_EMAIL from 'graphql/queries/getEmail.graphql';

import styles from './accountSection.module.scss';

const AccountSection = ({ session }) => {
  const { t } = useTranslation('header');
  const userId = get('userId', session);

  const NotLoggedInComponent = () => (
    <>
      <Link to={ROUTE_SIGN_UP}>{t('signUp')}</Link>
      <Link to={ROUTE_LOGIN}>{t('login')}</Link>
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

            return <Link to={ROUTE_PROFILE}>{email}</Link>;
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
