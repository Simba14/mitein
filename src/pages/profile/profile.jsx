import React, { useEffect } from 'react';
import classnames from 'classnames/bind';
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/client';
import { compose, get } from 'lodash/fp';

import Cta from 'components/atoms/cta';
import PersonalInfo from 'components/blocks/personalInfo';
import ChatsSection from 'components/blocks/chatsSection';
import LearnerCalendar from 'components/blocks/calendar/timeView/learner';
import NativeCalendar from 'components/blocks/calendar/timeView/native';
import Loading from 'components/atoms/loading';
import Suspended from 'components/blocks/suspended';
import Text from 'components/atoms/text';
import { withLayout } from 'components/blocks/layout';
import { useTranslation } from 'next-i18next';

import { sessionProps, withSessionContext } from 'context/session';
import GET_PROFILE from '@graphql/queries/getProfile.graphql';
import { ROUTE_LOGIN, ROUTE_CHATS_BOOK } from 'routes';
import { USER_TYPE_LEARNER, USER_TYPE_NATIVE } from '@api/firebase/constants';

import styles from './profile.module.scss';

const cx = classnames.bind(styles);

const Profile = ({ session }) => {
  const router = useRouter();
  const { t } = useTranslation('profile');
  const userId = get('userId', session);
  const { data, loading, error } = useQuery(GET_PROFILE, {
    variables: { id: userId },
    skip: !userId,
  });

  useEffect(() => {
    if (!(userId || data) || error) {
      router.push(ROUTE_LOGIN);
      session.userLoggedOut();
    }
  }, [userId]);

  if (loading) return <Loading />;
  if (error || !data) return null;

  const {
    user: {
      displayName,
      email,
      interests,
      chats: { booked, cancelled, past, rejected, requested },
      suspendedUntil,
      type,
    },
  } = data;

  const requestedChats = requested || rejected;
  const upcomingChats = booked || cancelled;

  const isLearner = type === USER_TYPE_LEARNER;
  const isNative = type === USER_TYPE_NATIVE;
  const isSuspended = suspendedUntil > new Date().toISOString();

  return (
    <div className={cx('wrapper')}>
      <PersonalInfo
        displayName={displayName}
        email={email}
        interests={interests}
        userId={userId}
      />
      {isLearner && !requested && Boolean(!suspendedUntil) && (
        <div className={cx('requestSection')}>
          <Cta
            to={ROUTE_CHATS_BOOK}
            className={cx('requestCta', { hasPast: past })}
            text={t('requestCta')}
          />
          {past && (
            <>
              <Text className={cx('separator')}>{t('separator')}</Text>
              <Text className={cx('rebookInfo')}>{t('rebookInfo')}</Text>
            </>
          )}
        </div>
      )}
      {isSuspended && <Suspended suspendedUntil={suspendedUntil} />}
      <ChatsSection
        requestedChats={requestedChats}
        upcomingChats={upcomingChats}
        pastChats={past}
        userType={type}
        userId={userId}
        userDisplayName={displayName}
      />
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
