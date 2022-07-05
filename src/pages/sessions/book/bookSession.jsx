import React, { useCallback, useEffect, useState } from 'react';
import classnames from 'classnames/bind';
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/client';
import { compose, get, groupBy } from 'lodash/fp';
import { useTranslation } from 'next-i18next';

import Cta from 'components/cta';
import Loading from 'components/loading';
import Slots from 'components/slots';
import Suspended from 'components/suspended';
import Text, { HEADING_1 } from 'components/text';
import { withLayout } from 'components/layout';

import { sessionProps, withSessionContext } from 'context/session';
import GET_PROFILE from '@graphql/queries/getProfile.graphql';
import { ROUTE_LOGIN, ROUTE_PROFILE } from 'routes';
import { LEARNER, REQUESTED } from '@constants/user';

import styles from './bookSession.module.scss';
const cx = classnames.bind(styles);

const BookSession = ({ session }) => {
  const { t } = useTranslation('session');
  const router = useRouter();
  const [bookingSuccessful, setBookingSuccessful] = useState();
  const userId = get('userId', session);
  const { data, loading, error, refetch } = useQuery(GET_PROFILE, {
    variables: { id: userId },
    skip: !userId,
  });

  const onSelect = useCallback(
    status => {
      refetch();
      setBookingSuccessful(status);
    },
    [refetch, setBookingSuccessful],
  );

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
  if (error || !data || bookingSuccessful) return null;

  const {
    user: { sessions, suspendedUntil, type },
  } = data;

  const sessionsByStatus = groupBy('status', sessions);
  const requestedSessions = sessionsByStatus[REQUESTED];

  const isLearner = type === LEARNER;
  const isSuspended = suspendedUntil > new Date().toISOString();

  const getContent = () => {
    const baseContent = component => (
      <div className={cx('content')}>
        {component}
        <Cta
          to={ROUTE_PROFILE}
          className={cx('cta')}
          text={t('slots.returnToProfile')}
          fullWidth
        />
      </div>
    );
    if (isSuspended)
      return baseContent(<Suspended suspendedUntil={suspendedUntil} />);

    if (requestedSessions)
      return baseContent(
        <Text className={cx('text')}>{t('slots.alreadyRequested')}</Text>,
      );

    if (isLearner) return <Slots userId={userId} onSelect={onSelect} />;

    return null;
  };

  return (
    <div className={cx('wrapper')}>
      <Text className={cx('title')} tag="h1" type={HEADING_1}>
        {t('slots.title')}
      </Text>
      {getContent()}
    </div>
  );
};

BookSession.propTypes = {
  session: sessionProps,
};

export { BookSession };
export default compose(withLayout, withSessionContext)(BookSession);
