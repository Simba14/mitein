import React, { useState } from 'react';
import classnames from 'classnames/bind';
import { useMutation, useQuery } from '@apollo/client';
import { useTranslation } from 'next-i18next';
import { string } from 'prop-types';
import { get } from 'lodash/fp';

import Calendar, {
  DELETE_SELECTED,
} from 'components/blocks/calendar/timeView/shared';
import Loading from 'components/atoms/loading';
import Text, { HEADING_4 } from 'components/atoms/text';
import GET_AVAILABILITY from '@graphql/queries/getAvailability.graphql';
import CREATE_CHATS from '@graphql/mutations/createChat.graphql';
import DELETE_CHATS from '@graphql/mutations/deleteChats.graphql';
import { CHAT_STATUS_AVAILABLE } from '@api/firebase/constants';
import useWindowDimensions from 'hooks/useWindowDimensions';
import { isSpecifiedBreakpoint } from 'helpers/index';
import { TABLET_WIDE } from '@constants/breakpoints';
import { UserType } from '@constants/types';

import styles from './native.module.scss';
const cx = classnames.bind(styles);

const GET_AVAILABILITY_QUERY = 'GetAvailability';

const NativeCalendar = ({ userId, userType }) => {
  const { t } = useTranslation('calendar');

  const [selectedEvents, setSelectedEvents] = useState([]);
  const [deleteAvailabilities] = useMutation(DELETE_CHATS);
  const [updateAvailability] = useMutation(CREATE_CHATS);
  const { data, loading, error } = useQuery(GET_AVAILABILITY, {
    variables: { userId },
  });
  const { width } = useWindowDimensions();
  const isSmallerViewport = isSpecifiedBreakpoint({
    breakpoint: TABLET_WIDE,
    width,
  });

  const availability = get('availability', data);

  const onCreateEvent = ({ startStr, endStr }) => {
    updateAvailability({
      variables: {
        participant1Id: userId,
        status: CHAT_STATUS_AVAILABLE,
        start: startStr,
        end: endStr,
        userType,
      },
      refetchQueries: [GET_AVAILABILITY_QUERY],
    });
  };

  const headerToolbar = {
    start: 'title',
    end: `${selectedEvents.length ? `${DELETE_SELECTED} ` : ''}${
      isSmallerViewport ? '' : 'today '
    }prev,next`,
  };
  console.log('NATIVE', { loading, error });
  if (loading) return <Loading />;
  if (error) return null;

  return (
    <section className={cx('calendar')}>
      <Text className={cx('title')} tag="h3" type={HEADING_4}>
        {t('availabilityTitle')}
      </Text>
      <div className={cx('instructions')}>{t('instructions')}</div>
      <Calendar
        events={availability}
        duration={isSmallerViewport ? 2 : 6}
        fixedWeekCount={false}
        headerToolbar={headerToolbar}
        onCreateEvent={onCreateEvent}
        onDelete={deleteAvailabilities}
        refetchQueries={[GET_AVAILABILITY_QUERY]}
        selectedEvents={selectedEvents}
        setSelectedEvents={setSelectedEvents}
      />
    </section>
  );
};

NativeCalendar.propTypes = {
  userId: string.isRequired,
  userType: UserType.isRequired,
};

export default NativeCalendar;
