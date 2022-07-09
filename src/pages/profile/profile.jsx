import React, { useEffect } from 'react';
import { useMutation } from '@apollo/client';
import classnames from 'classnames/bind';
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/client';
import { compose, get } from 'lodash/fp';
import { useTranslation } from 'next-i18next';

import Accordion from 'components/accordion';
import Cta from 'components/cta';
import LearnerCalendar from 'components/calendar/timeView/learner';
import NativeCalendar from 'components/calendar/timeView/native';
import Loading from 'components/loading';
import SessionCard from 'components/sessionCard';
import Suspended from 'components/suspended';
import { withLayout } from 'components/layout';

import { sessionProps, withSessionContext } from 'context/session';
import GET_PROFILE from '@graphql/queries/getProfile.graphql';
import SIGN_OUT from '@graphql/mutations/signOut.graphql';
import { ROUTE_LOGIN, ROUTE_SESSIONS_BOOK } from 'routes';
import { LEARNER, NATIVE, BOOKED, REJECTED, REQUESTED } from '@constants/user';

import styles from './profile.module.scss';
import PersonalInfo from 'components/personalInfo';

const cx = classnames.bind(styles);

const Profile = ({ session }) => {
  const { t } = useTranslation('profile');
  const router = useRouter();
  const userId = get('userId', session);
  const { data, loading, error } = useQuery(GET_PROFILE, {
    variables: { id: userId },
    skip: !userId,
  });

  const signOutSuccessful = () => {
    router.push(ROUTE_LOGIN);
    session.userLoggedOut();
  };

  const [signOut, { loading: signOutLoading }] = useMutation(SIGN_OUT, {
    onCompleted: signOutSuccessful,
  });

  useEffect(() => {
    if (!(userId || loading || data) || error) {
      session.userLoggedOut();
      router.push(ROUTE_LOGIN);
    }
  }, [userId, loading]);

  if (loading) return <Loading />;
  if (error || !data) return null;

  const {
    user: {
      displayName,
      email,
      interests,
      chats: { booked, rejected, requested },
      suspendedUntil,
      type,
    },
  } = data;

  const requestedAccordionData = requested || rejected;

  const isLearner = type === LEARNER;
  const isNative = type === NATIVE;
  const isSuspended = suspendedUntil > new Date().toISOString();

  return (
    <div className={cx('wrapper')}>
      <PersonalInfo
        displayName={displayName}
        email={email}
        interests={interests}
        signOut={signOut}
        signOutDisabled={signOutLoading}
        userId={userId}
      />
      {isSuspended && <Suspended suspendedUntil={suspendedUntil} />}
      {booked && (
        <Accordion
          className={cx('accordion')}
          contentClassName={cx('sessionsContainer')}
          ariaId="booked sessions accordion"
          headerText={t('accordionHeader.upcoming')}
          content={booked.map(session => (
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
              status={requested ? REQUESTED : REJECTED}
              userType={type}
              userId={userId}
            />
          ))}
          open={true}
        />
      )}
      {isLearner && !requested && Boolean(!suspendedUntil) && (
        <Cta
          to={ROUTE_SESSIONS_BOOK}
          className={cx('requestCta')}
          text={'Request a Session'}
        />
      )}
      {isNative && !isSuspended && (
        <NativeCalendar userId={userId} userType={type} />
      )}
      {isLearner && !isSuspended && (
        <LearnerCalendar userId={userId} userType={type} />
      )}
    </div>
  );
};

Profile.propTypes = {
  session: sessionProps,
};

export { Profile };
export default compose(withLayout, withSessionContext)(Profile);
