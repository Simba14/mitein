import React, { useEffect } from 'react';
import classnames from 'classnames/bind';
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/client';
import { compose, get } from 'lodash/fp';
import { useTranslation } from 'next-i18next';

import Accordion from 'components/atoms/accordion';
import Cta from 'components/atoms/cta';
import LearnerCalendar from 'components/blocks/calendar/timeView/learner';
import NativeCalendar from 'components/blocks/calendar/timeView/native';
import Loading from 'components/atoms/loading';
import ChatCard from 'components/blocks/chatCard';
import Suspended from 'components/blocks/suspended';
import Text from 'components/atoms/text';
import { withLayout } from 'components/blocks/layout';

import { sessionProps, withSessionContext } from 'context/session';
import GET_PROFILE from '@graphql/queries/getProfile.graphql';
import { ROUTE_LOGIN, ROUTE_CHATS_BOOK } from 'routes';
import { USER_TYPE_LEARNER, USER_TYPE_NATIVE } from '@api/firebase/constants';

import styles from './profile.module.scss';
import PersonalInfo from 'components/blocks/personalInfo';
import Anchor from 'components/atoms/anchor';

const cx = classnames.bind(styles);

const Profile = ({ session }) => {
  const { t } = useTranslation('profile');
  const router = useRouter();
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
  console.log({ error, data });
  if (loading) return <Loading />;
  if (error || !data) return null;

  const {
    user: {
      displayName,
      email,
      interests,
      chats: { booked, cancelled, rejected, requested },
      suspendedUntil,
      type,
    },
  } = data;

  const requestedAccordionData = requested || rejected;
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
      {isSuspended && <Suspended suspendedUntil={suspendedUntil} />}
      {upcomingChats && (
        <Accordion
          className={cx('accordion')}
          headerClassName={cx('accordionHeader')}
          ariaId="booked chats accordion"
          headerText={t('accordionHeader.upcoming')}
          content={
            <>
              <Text className={cx('bookedDescription')}>
                {t('chatInfo')}
                <Anchor href={t('zoomHelp')} underlined>
                  {t('chatInfoClick')}
                </Anchor>
              </Text>
              <div className={cx('chatsContainer')}>
                {upcomingChats.map(chat => (
                  <ChatCard
                    key={chat.id}
                    chat={chat}
                    status={chat.status}
                    userType={type}
                    userId={userId}
                  />
                ))}
              </div>
            </>
          }
          open={true}
        />
      )}
      {requestedAccordionData && (
        <Accordion
          className={cx('accordion')}
          headerClassName={cx('accordionHeader')}
          contentClassName={cx('chatsContainer')}
          ariaId="requested chats accordion"
          headerText={t('accordionHeader.requested')}
          content={requestedAccordionData.map(chat => (
            <ChatCard
              key={chat.id}
              chat={chat}
              status={chat.status}
              userType={type}
              userId={userId}
            />
          ))}
          open={true}
        />
      )}
      {isLearner && !requested && Boolean(!suspendedUntil) && (
        <Cta
          to={ROUTE_CHATS_BOOK}
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
