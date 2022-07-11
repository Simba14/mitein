import React, { useCallback, useEffect } from 'react';
import classnames from 'classnames/bind';
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/client';
import { compose, get } from 'lodash/fp';
import { useTranslation } from 'next-i18next';

import Cta from 'components/atoms/cta';
import Loading from 'components/atoms/loading';
import Slots from 'components/blocks/slots';
import Suspended from 'components/blocks/suspended';
import Text, { HEADING_1 } from 'components/atoms/text';
import { withLayout } from 'components/blocks/layout';

import { sessionProps, withSessionContext } from 'context/session';
import GET_PROFILE from '@graphql/queries/getProfile.graphql';
import { ROUTE_LOGIN, ROUTE_PROFILE } from 'routes';
import { LEARNER } from '@constants/user';

import styles from './bookChat.module.scss';
const cx = classnames.bind(styles);

const BookChat = ({ session }) => {
  const { t } = useTranslation('chat');
  const router = useRouter();
  const userId = get('userId', session);
  const { data, loading, error, refetch } = useQuery(GET_PROFILE, {
    variables: { id: userId },
    skip: !userId,
  });

  const onSelect = useCallback(() => {
    router.push(ROUTE_PROFILE);
    refetch();
  }, [refetch]);

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
    user: {
      chats: { requested },
      suspendedUntil,
      type,
    },
  } = data;

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

    if (requested)
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

BookChat.propTypes = {
  session: sessionProps,
};

export { BookChat };
export default compose(withLayout, withSessionContext)(BookChat);
