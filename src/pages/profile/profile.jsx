import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useQuery, useMutation } from 'urql';
// import { useQuery } from '@apollo/client';
// import { Mutation } from '@apollo/client/react/components';
import { compose, get, groupBy, take } from 'lodash/fp';
import { useTranslation } from 'next-i18next';
import { withUrqlClient } from 'next-urql';

import Accordion from 'components/accordion';
import Calendar from 'components/calendar';
import Cta from 'components/cta';
import SessionCard from 'components/sessionCard';
import Slots from 'components/slots';
import { withLayout } from 'components/layout';

import { sessionProps, withSessionContext } from 'context/session';
import GET_PROFILE from '@graphql/queries/getProfile.graphql';
import SIGN_OUT from '@graphql/mutations/signOut.graphql';
import { ROUTE_BASE, ROUTE_LOGIN } from 'routes';
import { LEARNER, NATIVE, BOOKED, REJECTED, REQUESTED } from 'constants/user';

import styles from './profile.module.scss';

const Profile = ({ session }) => {
  const {
    i18n: { language },
    t,
  } = useTranslation('profile');
  const router = useRouter();
  const userId = get('userId', session);
  const [result, refetch] = useQuery({
    query: GET_PROFILE,
    variables: { id: userId },
  });

  const [signOutResult, signOut] = useMutation(SIGN_OUT);

  const { data, fetching, error } = result;

  useEffect(() => {
    if (!(userId || fetching)) {
      router.push(ROUTE_LOGIN);
    }
  }, [userId, fetching]);

  if (fetching) return <div>LOADING</div>;
  if (error) return `Error! ${error.message}`;

  const {
    user: { sessions, displayName, email, type },
  } = data;

  const { fetching: signOutLoading } = signOutResult;
  const sessionsByStatus = groupBy('status', sessions);
  const requestedSessions = sessionsByStatus[REQUESTED];
  const latestSessionIsRejected = get('[0].status', sessions) === REJECTED;
  const requestedAccordionData =
    requestedSessions || (latestSessionIsRejected && take(1, sessions));
  const bookedSessions = sessionsByStatus[BOOKED];
  const isLearner = type === LEARNER;
  const isNative = type === NATIVE;

  const onSignOut = () => {
    signOut().then(() => {
      router.push(`${language}${ROUTE_BASE}`);
      session.userLoggedOut();
    });
  };

  return (
    <div>
      <div className={styles.topContainer}>
        <div>
          <div>{t('title')}</div>
          <div>Email: {email}</div>
          <div>Display Name: {displayName}</div>
          <div>Account type: {type}</div>
        </div>

        <div>
          <Cta
            className={styles.logOut}
            onClick={onSignOut}
            disabled={signOutLoading}
            text={t('logOut')}
          />
        </div>
      </div>
      {bookedSessions && (
        <Accordion
          className={styles.accordion}
          ariaId="booked sessions accordion"
          headerText={t('accordionHeader.upcoming')}
          content={bookedSessions.map((session) => (
            <SessionCard
              key={session.id}
              session={session}
              status={BOOKED}
              ctaCallback={refetch}
              userType={type}
            />
          ))}
          open={true}
        />
      )}
      {requestedAccordionData && (
        <Accordion
          className={styles.accordion}
          ariaId="requested sessions accordion"
          headerText={t('accordionHeader.requested')}
          content={requestedAccordionData.map((session) => (
            <SessionCard
              key={session.id}
              ctaCallback={refetch}
              session={session}
              status={requestedSessions ? REQUESTED : REJECTED}
              userType={type}
            />
          ))}
          open={true}
        />
      )}
      {isLearner && !requestedSessions && (
        <Slots language={language} userId={userId} onSelect={refetch} />
      )}
      {isNative && <Calendar userId={userId} />}
    </div>
  );
};

Profile.propTypes = {
  session: sessionProps,
};

export { Profile };
export default compose(withLayout, withSessionContext)(Profile);
