import React from 'react';
import { navigate } from 'gatsby';
import { Mutation, Query } from '@apollo/client/react/components';
import { compose } from 'lodash/fp';
import { useTranslation } from 'react-i18next';

import { sessionProps, withSessionContext } from 'context/session';
import { withLayout } from 'components/layout';
import Calendar from 'components/calendar';
import Slots from 'components/slots';
import GET_PROFILE from 'graphql/queries/getProfile.graphql';
import SIGN_OUT from 'graphql/mutations/signOut.graphql';
import { ROUTE_BASE } from 'routes';

import styles from './profile.module.scss';

const Profile = ({ session }) => {
  const { t } = useTranslation('profile');
  const userId = session && session.userId;
  if (!userId) return <div>Uh oh</div>;

  const signOutSuccessful = () => {
    navigate(ROUTE_BASE);
    session.userLoggedOut();
  };

  return (
    <Query query={GET_PROFILE} variables={{ id: userId }}>
      {({ data, loading, error }) => {
        if (loading) return <div>LOADING</div>;
        if (error) return `Error! ${error.message}`;
        // console.log({ data });
        const {
          user: { email, type },
        } = data;

        return (
          <div>
            <div className={styles.topContainer}>
              <div>
                <div>{t('title')}</div>
                <div>Email: {email}</div>
                <div>Account type: {type}</div>
              </div>
              <div>
                <Mutation mutation={SIGN_OUT} onCompleted={signOutSuccessful}>
                  {(signOut, { loading: signOutLoading }) => (
                    <button
                      className={styles.logOut}
                      onClick={signOut}
                      disabled={signOutLoading}
                    >
                      {t('logOut')}
                    </button>
                  )}
                </Mutation>
              </div>
            </div>
            {type === 'LEARNER'} && <Slots />
            {type === 'NATIVE' && <Calendar userId={userId} />}
          </div>
        );
      }}
    </Query>
  );
};

Profile.propTypes = {
  session: sessionProps,
};

export { Profile };
export default compose(withLayout, withSessionContext)(Profile);
