import React, { useCallback, useEffect } from 'react';
import classnames from 'classnames/bind';
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/client';
import { compose, get } from 'lodash/fp';
import { useTranslation } from 'next-i18next';

import Cta from 'components/atoms/cta';
import { LoadingLogo } from 'components/atoms/loading';
import Slots from 'components/blocks/slots';
import Suspended from 'components/blocks/suspended';
import Text, { HEADING_1 } from 'components/atoms/text';
import { withLayout } from 'components/blocks/layout';

import { sessionProps, withSessionContext } from 'context/session';
import GET_PROFILE from '@graphql/queries/getProfile.graphql';
import { ROUTE_LOGIN, ROUTE_PROFILE } from 'routes';
import { USER_TYPE_LEARNER } from '@api/firebase/constants';

import styles from './bookingPage.module.scss';
import { bool, string } from 'prop-types';
const cx = classnames.bind(styles);

const BookingPage = ({ id, keyPrefix, requestLimit, session }) => {
  const { t } = useTranslation('chat', { keyPrefix });
  const router = useRouter();
  const userId = get('userId', session);
  const { data, loading, error, refetch } = useQuery(GET_PROFILE, {
    variables: { id: userId },
    skip: !userId,
  });

  const onSelect = useCallback(
    redirect => {
      if (redirect) router.push(ROUTE_PROFILE);
      refetch();
    },
    [refetch],
  );

  useEffect(() => {
    if (!userId || (!loading && (!data || error))) {
      session.userLoggedOut();
      router.push(ROUTE_LOGIN);
    }
  }, [userId, loading]);

  useEffect(() => {
    const userType = get('user.type', data);

    if (userType && userType !== USER_TYPE_LEARNER) {
      router.push(ROUTE_PROFILE);
    }
  }, [data]);

  if (loading) return <LoadingLogo />;
  if (error || !data) return null;

  const {
    user: {
      displayName,
      chats: { requested },
      suspendedUntil,
      type,
    },
  } = data;

  const isLearner = type === USER_TYPE_LEARNER;
  const isSuspended = suspendedUntil > new Date().toISOString();

  const getContent = () => {
    const baseContent = component => (
      <div className={cx('content')}>
        {component}
        <Cta
          to={ROUTE_PROFILE}
          className={cx('cta')}
          text={t('returnToProfile')}
          fullWidth
        />
      </div>
    );

    if (isSuspended)
      return baseContent(<Suspended suspendedUntil={suspendedUntil} />);

    if (requestLimit && requested)
      return baseContent(
        <Text className={cx('text')}>{t('alreadyRequested')}</Text>,
      );

    if (isLearner)
      return (
        <Slots
          slotsOfUserId={id}
          noAvailabilityText={t('noneAvailable')}
          requesterId={userId}
          requesterDisplayName={displayName}
          onSelect={onSelect}
        />
      );

    return null;
  };

  return (
    <div className={cx('wrapper')}>
      <Text className={cx('title')} tag="h1" type={HEADING_1}>
        {t('title')}
      </Text>
      {getContent()}
    </div>
  );
};

BookingPage.propTypes = {
  id: string,
  keyPrefix: string,
  requestLimit: bool,
  session: sessionProps,
};

BookingPage.defaultProps = {
  id: null,
  keyPrefix: null,
  requestLimit: false,
};

export { BookingPage };
export default compose(withLayout, withSessionContext)(BookingPage);
