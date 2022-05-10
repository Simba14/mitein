import React, { useEffect, useState } from 'react';
import { useMutation } from '@apollo/client';
import classnames from 'classnames/bind';
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/client';
import { compose, get, groupBy, isEmpty, take } from 'lodash/fp';
import { useTranslation } from 'next-i18next';
import { without } from 'lodash';
// import { COLLECTION_SESSIONS } from '@api/firebase/constants';
// import { Firestore } from '@api/firebase';

import Accordion from 'components/accordion';
import Cta from 'components/cta';
import LearnerCalendar from 'components/calendar/timeView/learner';
import Modal from 'components/modal';
import NativeCalendar from 'components/calendar/timeView/native';
import Loading from 'components/loading';
import SessionCard from 'components/sessionCard';
import Suspended from 'components/suspended';
import Text, { BODY_6, HEADING_2, HEADING_4 } from 'components/text';
import { withLayout } from 'components/layout';

import Svg, { CLOSE } from 'components/svg';
import { sessionProps, withSessionContext } from 'context/session';
import GET_PROFILE from '@graphql/queries/getProfile.graphql';
import SIGN_OUT from '@graphql/mutations/signOut.graphql';
import UPDATE_PROFILE from '@graphql/mutations/updateUser.graphql';
import { ROUTE_LOGIN, ROUTE_SESSIONS_BOOK } from 'routes';
import {
  LEARNER,
  NATIVE,
  BOOKED,
  REJECTED,
  REQUESTED,
  INTERESTS,
} from '@constants/user';

import styles from './profile.module.scss';
const cx = classnames.bind(styles);

const Profile = ({ session }) => {
  const { t } = useTranslation('profile');
  const router = useRouter();
  const userId = get('userId', session);
  const [interestsOpen, setInterestsOpen] = useState(false);
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

  const [updateProfile] = useMutation(UPDATE_PROFILE);

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

  const handleUpdateProfile = ({ addInterest, deleteInterest }) => {
    updateProfile({
      variables: {
        id: userId,
        fields: {
          interests: deleteInterest
            ? without(interests, deleteInterest)
            : [...(interests || []), addInterest],
        },
      },
    });
  };

  useEffect(() => {
    if (!(userId || loading || data) || error) {
      session.userLoggedOut();
      router.push(ROUTE_LOGIN);
    }
  }, [userId, loading]);

  if (loading) return <Loading />;
  if (error || !data) return null;

  const {
    user: { sessions, displayName, email, interests, suspendedUntil, type },
  } = data;

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
          <Text className={cx('title')} tag="h1" type={HEADING_2}>
            {t('title')}
          </Text>
          <Text>{t('email', { email })}</Text>
          <Text>{t('name', { displayName })}</Text>
          <Text className={cx('accountType')}>{t('account', { type })}</Text>
          <div className={cx('interests')}>
            <Text className={cx('label')} tag="label">
              {t('interests.label')}
            </Text>
            {interests?.length ? (
              interests.map(interest => (
                <button
                  key={`selected ${interest}`}
                  className={cx('interest')}
                  onClick={() =>
                    handleUpdateProfile({ deleteInterest: interest })
                  }
                >
                  {interest}
                  <Svg className={cx('delete')} name={CLOSE} />
                </button>
              ))
            ) : (
              <Text type={BODY_6}>{t('interests.none')}</Text>
            )}
            <Cta
              aria-label={t('editLabel')}
              aria-haspopup="dialog"
              className={cx('edit')}
              onClick={() => setInterestsOpen(true)}
              text={t('interests.edit')}
            />
          </div>

          <Modal open={interestsOpen} onClose={() => setInterestsOpen(false)}>
            <div className={cx('addInterests')}>
              <Text className={cx('interestsHeading')} type={HEADING_4}>
                {t('interests.heading')}
              </Text>
              <Text className={cx('description')} type={BODY_6}>
                {t('interests.description')}
              </Text>
              <Text className={cx('instruction')} type={BODY_6} tag="strong">
                {t('interests.instructions')}
              </Text>
              <div className={cx('options')}>
                {INTERESTS.map(interest => {
                  const selected = interests?.find(el => el === interest);
                  return (
                    <button
                      key={interest}
                      className={cx('interest', { selected })}
                      onClick={() =>
                        handleUpdateProfile({
                          [selected ? 'deleteInterest' : 'addInterest']:
                            interest,
                        })
                      }
                    >
                      {interest}
                    </button>
                  );
                })}
              </div>
            </div>
          </Modal>
        </div>
        <div>
          <Cta
            className={cx('logOut')}
            onClick={signOut}
            outline
            disabled={signOutLoading}
            text={t('logOut')}
          />
        </div>
      </div>
      {isSuspended && <Suspended suspendedUntil={suspendedUntil} />}
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
