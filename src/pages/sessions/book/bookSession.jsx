import React, { useEffect } from 'react';
import classnames from 'classnames/bind';
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/client';
import { compose, get, groupBy } from 'lodash/fp';
import { useTranslation } from 'next-i18next';

import Loading from 'components/loading';
import Slots from 'components/slots';
import { withLayout } from 'components/layout';

import { sessionProps, withSessionContext } from 'context/session';
import GET_PROFILE from '@graphql/queries/getProfile.graphql';
import { ROUTE_LOGIN, ROUTE_PROFILE } from 'routes';
import { formatSessionDate } from 'helpers/index';
import { LEARNER, REQUESTED } from 'constants/user';

import styles from './bookSession.module.scss';
const cx = classnames.bind(styles);

const BookSession = ({ session }) => {
  const {
    i18n: { language },
    t,
  } = useTranslation('session');
  const router = useRouter();
  const userId = get('userId', session);
  const { data, loading, error, refetch } = useQuery(GET_PROFILE, {
    variables: { id: userId },
    skip: !userId,
  });

  useEffect(() => {
    if (!userId || (!loading && (!data || error))) {
      session.userLoggedOut();
      router.push(ROUTE_LOGIN);
    }
  }, [userId, loading]);

  useEffect(() => {
    const userType = get('user.type', data);

    if (userType && userType !== LEARNER) {
      router.push(ROUTE_PROFILE);
    }
  }, [data]);

  if (loading) return <Loading />;
  if (error || !data) return null;

  const {
    user: { sessions, suspendedUntil, type },
  } = data;

  const sessionsByStatus = groupBy('status', sessions);
  const requestedSessions = sessionsByStatus[REQUESTED];

  const isLearner = type === LEARNER;
  const isSuspended = suspendedUntil > new Date().toISOString();

  return (
    <div>
      <h1 className={cx('title')}>{t('slots.title')}</h1>
      {isSuspended && (
        <div className={cx('suspended')}>
          {t('suspendedUntil', {
            date: formatSessionDate(suspendedUntil, language),
          })}
          <div className={cx('suspendedNote')}>{t('suspendedNote')}</div>
        </div>
      )}
      {isLearner && !requestedSessions && Boolean(!suspendedUntil) && (
        <Slots userId={userId} onSelect={refetch} />
      )}
    </div>
  );
};

BookSession.propTypes = {
  session: sessionProps,
};

export { BookSession };
export default compose(withLayout, withSessionContext)(BookSession);
