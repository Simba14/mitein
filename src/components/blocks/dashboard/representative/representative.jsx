import React from 'react';
import classnames from 'classnames/bind';
import { useTranslation } from 'next-i18next';
import { useQuery } from '@apollo/client';

import AddOrganization from 'components/blocks/addOrganization';
import Cta from 'components/atoms/cta';
import PersonalInfo from 'components/blocks/personalInfo';
import ChatsSection from 'components/blocks/chatsSection';
import { LoadingLogo } from 'components/atoms/loading';
import Suspended from 'components/blocks/suspended';
import Text from 'components/atoms/text';

import GET_ORGANIZATION from '@graphql/queries/getOrganization.graphql';

import styles from './representative.module.scss';
import { UserPropTypes } from '@constants/types';

const cx = classnames.bind(styles);

const RepresentativeDashboard = ({ user }) => {
  const {
    t,
    i18n: { language },
  } = useTranslation('profile');
  const { data, loading, error } = useQuery(GET_ORGANIZATION, {
    variables: { userId: user?.id, locale: language },
    skip: !user?.id,
  });

  if (loading) return <LoadingLogo />;

  const organization = data?.organization;

  const { displayName, email, interests, suspendedUntil, type } = user;

  return (
    <>
      {organization ? <div>ADD EVENT</div> : <AddOrganization />}
      {/* <PersonalInfo
        displayName={displayName}
        email={email}
        interests={interests}
        userId={userId}
      /> */}
      {/* {isLearner && !requested && Boolean(!suspendedUntil) && (
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
      )} */}
      {/* {isSuspended && <Suspended suspendedUntil={suspendedUntil} />}
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
      )} */}
    </>
  );
};

RepresentativeDashboard.propTypes = {
  user: UserPropTypes,
};

export default RepresentativeDashboard;
