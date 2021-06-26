import React, { useEffect } from 'react';
import classnames from 'classnames/bind';
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/client';
import { Mutation } from '@apollo/client/react/components';
import { compose, get, groupBy, take } from 'lodash/fp';
import { useTranslation } from 'next-i18next';

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
  const { data, loading, error, refetch } = useQuery(GET_PROFILE, {
    variables: { id: userId },
  });

  useEffect(() => {
    if (!(userId || loading)) {
      router.push(ROUTE_LOGIN);
    }
  }, [userId, loading]);

  if (loading) return <div>LOADING</div>;
  if (error) return `Error! ${error.message}`;

  const {
    user: { sessions, displayName, email, suspendedUntil, type },
  } = data;

  const signOutSuccessful = () => {
    router.push(`${language}${ROUTE_BASE}`);
    session.userLoggedOut();
  };

  const sessionsByStatus = groupBy('status', sessions);
  const requestedSessions = sessionsByStatus[REQUESTED];
  const latestSessionIsRejected = get('[0].status', sessions) === REJECTED;
  const requestedAccordionData =
    requestedSessions || (latestSessionIsRejected && take(1, sessions));
  const bookedSessions = sessionsByStatus[BOOKED];
  const isLearner = type === LEARNER;
  const isNative = type === NATIVE;

  return (
    <div>
      <div className={cx('topContainer')}>
        <div>
          <div>{t('title')}</div>
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
                disabled={signOutLoading}
                text={t('logOut')}
              />
            )}
          </Mutation>
        </div>
      </div>
      {suspendedUntil && (
        <div className={cx('suspended')}>
          {t('suspendedUntil', {
            date: formatSessionDate(suspendedUntil, language),
          })}
          <div className={cx('suspendedNote')}>{t('suspendedNote')}</div>
        </div>
      )}
      {bookedSessions && (
        <Accordion
          className={cx('accordion')}
          ariaId="booked sessions accordion"
          headerText={t('accordionHeader.upcoming')}
          content={bookedSessions.map((session) => (
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
          ariaId="requested sessions accordion"
          headerText={t('accordionHeader.requested')}
          content={requestedAccordionData.map((session) => (
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
      {isLearner && !requestedSessions && (
        <Slots userId={userId} onSelect={refetch} />
      )}
      {isNative && Boolean(!suspendedUntil) && <Calendar userId={userId} />}
    </div>
  );
};

Profile.propTypes = {
  session: sessionProps,
};

export { Profile };
export default compose(withLayout, withSessionContext)(Profile);
