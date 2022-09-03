import React, { useCallback, useEffect } from 'react';
import { string } from 'prop-types';
import classnames from 'classnames/bind';
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/client';
import { compose, get } from 'lodash/fp';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { isEmpty } from 'lodash/fp';

import Cta from 'components/atoms/cta';
import Loading from 'components/atoms/loading';
import Text, { HEADING_1 } from 'components/atoms/text';
import Slots from 'components/blocks/slots';
import { withLayout } from 'components/blocks/layout';

import { sessionProps, withSessionContext } from 'context/session';
import GET_CHATS from '@graphql/queries/getChats.graphql';
import { ROUTE_LOGIN, ROUTE_PROFILE } from 'routes';
import {
  CHAT_STATUS_AVAILABLE,
  USER_TYPE_LEARNER,
} from '@api/firebase/constants';

import styles from './rebook.module.scss';
const cx = classnames.bind(styles);

export const getServerSideProps = async ({ locale, params }) => {
  const id = get('id', params);
  if (!id) {
    return {
      redirect: {
        destination: ROUTE_PROFILE,
        permanent: false,
      },
    };
  }
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        'common',
        'errors',
        'menu',
        'form',
      ])),
      id,
    },
  };
};

const RebookChat = ({ id, session }) => {
  const { t } = useTranslation('chat', { keyPrefix: 'rebook' });
  const router = useRouter();
  const userId = get('userId', session);
  const { data, loading, error } = useQuery(GET_CHATS, {
    variables: { participant1Id: id, status: CHAT_STATUS_AVAILABLE },
    skip: !id,
  });

  const onSelect = useCallback(() => {
    router.push(ROUTE_PROFILE);
    // refetch();
  }, []);

  useEffect(() => {
    if (!userId || (!loading && (!data || error))) {
      session.userLoggedOut();
      router.push(ROUTE_LOGIN);
    }
  }, [userId, loading]);

  if (loading) return <Loading />;
  if (error || !data) return null;

  const { chats } = data;

  return (
    <div className={cx('wrapper')}>
      <Text className={cx('title')} tag="h1" type={HEADING_1}>
        {t('title')}
      </Text>
      <div className={cx('content')}>
        {isEmpty(chats) ? <Text>{t('noneAvailable')}</Text> : <Slots />}
        <Cta
          to={ROUTE_PROFILE}
          className={cx('cta')}
          text={t('returnToProfile')}
          fullWidth
        />
      </div>
    </div>
  );
};

RebookChat.propTypes = {
  id: string,
  session: sessionProps,
};

export { RebookChat };
export default compose(withLayout, withSessionContext)(RebookChat);
