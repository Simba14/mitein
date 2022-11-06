import React from 'react';
import classnames from 'classnames/bind';
import { useTranslation } from 'next-i18next';

import Cta from 'components/atoms/cta';
import PersonalInfo from 'components/blocks/personalInfo';
import ChatsSection from 'components/blocks/chatsSection';
import LearnerCalendar from 'components/blocks/calendar/timeView/learner';
import NativeCalendar from 'components/blocks/calendar/timeView/native';
import Suspended from 'components/blocks/suspended';
import Text from 'components/atoms/text';

import { ROUTE_CHATS_BOOK } from 'routes';
import { USER_TYPE_LEARNER, USER_TYPE_NATIVE } from '@api/firebase/constants';

import styles from './individual.module.scss';
import { UserPropTypes } from '@constants/types';

const cx = classnames.bind(styles);

const IndivualDashboard = ({ user }) => {
  const { t } = useTranslation('profile');
  const {
    id,
    displayName,
    email,
    interests,
    chats: { booked, cancelled, past, rejected, requested },
    suspendedUntil,
    type,
  } = user;

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
        userId={id}
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
              <Text className={cx('separator')} bold>
                {t('separator')}
              </Text>
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
        userId={id}
        userDisplayName={displayName}
      />
      {isNative && !isSuspended && (
        <NativeCalendar userId={id} userType={type} />
      )}
      {isLearner && !isSuspended && (
        <LearnerCalendar userId={id} userType={type} />
      )}
    </div>
  );
};

IndivualDashboard.propTypes = {
  user: UserPropTypes,
};

export default IndivualDashboard;
