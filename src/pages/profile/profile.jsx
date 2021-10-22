import React, { useEffect } from 'react';
import classnames from 'classnames/bind';
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/client';
import { Mutation } from '@apollo/client/react/components';
import { compose, get, groupBy, isEmpty, take } from 'lodash/fp';
import { useTranslation } from 'next-i18next';
// import { COLLECTION_SESSIONS } from '@api/firebase/constants';
// import { Firestore } from '@api/firebase';

import Accordion from 'components/accordion';
import Availability from 'components/availability';
import Calendar from 'components/calendar';
import Cta from 'components/cta';
import Loading from 'components/loading';
import SessionCard from 'components/sessionCard';
import { withLayout } from 'components/layout';

import { sessionProps, withSessionContext } from 'context/session';
import GET_PROFILE from '@graphql/queries/getProfile.graphql';
import SIGN_OUT from '@graphql/mutations/signOut.graphql';
import { ROUTE_LOGIN, ROUTE_SESSIONS_BOOK } from 'routes';
import { formatSessionDate } from 'helpers/index';
import { LEARNER, NATIVE, BOOKED, REJECTED, REQUESTED } from 'constants/user';

import styles from './profile.module.scss';
const cx = classnames.bind(styles);

const Profile = ({ session }) => {
  const {
    i18n: { language },
    t,
  } = useTranslation('profile');
  const router = useRouter();
  const userId = get('userId', session);
  const { data, loading, error } = useQuery(GET_PROFILE, {
    variables: { id: userId },
    skip: !userId,
  });

  // useEffect(() => {
  //   const unsubscribe = Firestore.db
  //     .collection(COLLECTION_SESSIONS)
  //     .onSnapshot(snapshot => {
  //       if (snapshot.size) {
  //         console.log({ snapshot });
  //       } else {
  //         // it's empty
  //       }
  //     });
  //   return () => {
  //     unsubscribe();
  //   };
  // }, []);

  useEffect(() => {
    if (!(userId || loading || data) || error) {
      session.userLoggedOut();
      router.push(ROUTE_LOGIN);
    }
  }, [userId, loading]);

  if (loading) return <Loading />;
  if (error || !data) return null;

  const {
    user: { sessions, displayName, email, suspendedUntil, type },
  } = data;

  const signOutSuccessful = () => {
    router.push(ROUTE_LOGIN);
    session.userLoggedOut();
  };

  const sessionsByStatus = groupBy('status', sessions);
  const requestedSessions = sessionsByStatus[REQUESTED];
  const latestSessionIsRejected = get('[0].status', sessions) === REJECTED;
  const requestedAccordionData =
    requestedSessions || (latestSessionIsRejected && take(1, sessions));
  const bookedSessions =
    sessionsByStatus[BOOKED] &&
    sessionsByStatus[BOOKED].filter(
      session => session.end > new Date().toISOString(),
    );
  const isLearner = type === LEARNER;
  const isNative = type === NATIVE;
  const isSuspended = suspendedUntil > new Date().toISOString();

  return (
    <div className={cx('wrapper')}>
      <div className={cx('topContainer')}>
        <div>
          <h1 className={cx('title')}>{t('title')}</h1>
          <div>Email: {email}</div>
          <div>Display Name: {displayName}</div>
          <div>Account type: {type}</div>
        </div>

        <div>
          <Mutation mutation={SIGN_OUT} onCompleted={signOutSuccessful}>
            {(signOut, { loading: signOutLoading }) => (
              <Cta
                className={cx('logOut')}
                onClick={signOut}
                outline
                disabled={signOutLoading}
                text={t('logOut')}
              />
            )}
          </Mutation>
        </div>
      </div>
      {isSuspended && (
        <div className={cx('suspended')}>
          {t('suspendedUntil', {
            date: formatSessionDate(suspendedUntil, language),
          })}
          <div className={cx('suspendedNote')}>{t('suspendedNote')}</div>
        </div>
      )}
      {!isEmpty(bookedSessions) && (
        <Accordion
          className={cx('accordion')}
          contentClassName={cx('sessionsContainer')}
          ariaId="booked sessions accordion"
          headerText={t('accordionHeader.upcoming')}
          content={bookedSessions.map(session => (
            <SessionCard
              key={session.id}
              session={session}
              status={BOOKED}
              userType={type}
              userId={userId}
            />
          ))}
          open={true}
        />
      )}
      {requestedAccordionData && (
        <Accordion
          className={cx('accordion')}
          contentClassName={cx('sessionsContainer')}
          ariaId="requested sessions accordion"
          headerText={t('accordionHeader.requested')}
          content={requestedAccordionData.map(session => (
            <SessionCard
              key={session.id}
              session={session}
              status={requestedSessions ? REQUESTED : REJECTED}
              userType={type}
              userId={userId}
            />
          ))}
          open={true}
        />
      )}
      {isLearner && !requestedSessions && Boolean(!suspendedUntil) && (
        <Cta
          to={ROUTE_SESSIONS_BOOK}
          className={cx('requestCta')}
          text={'Request a Session'}
        />
      )}
      {isNative && Boolean(!suspendedUntil) && <Calendar userId={userId} />}
      {isLearner && Boolean(!suspendedUntil) && (
        <Availability userId={userId} />
      )}
    </div>
  );
};

Profile.propTypes = {
  session: sessionProps,
};

export { Profile };
export default compose(withLayout, withSessionContext)(Profile);
