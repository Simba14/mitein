import React, { useState } from 'react';
import classnames from 'classnames/bind';
import { useMutation, useQuery } from '@apollo/client';
import { useTranslation } from 'next-i18next';
import { string } from 'prop-types';
import { get } from 'lodash/fp';

import Calendar, { DELETE_SELECTED } from 'components/calendar/timeView/shared';
import Loading from 'components/loading';
import GET_AVAILABILITY from '@graphql/queries/getAvailability.graphql';
import CREATE_SESSIONS from '@graphql/mutations/createSession.graphql';
import DELETE_SESSIONS from '@graphql/mutations/deleteSessions.graphql';
import { AVAILABLE } from '@constants/user';
import useWindowDimensions from 'hooks/useWindowDimensions';
import { getIsMobile } from 'helpers/index';

import styles from './native.module.scss';
const cx = classnames.bind(styles);

const GET_AVAILABILITY_QUERY = 'GetAvailability';

const NativeCalendar = ({ userId, userType }) => {
  const { t } = useTranslation('calendar');

  const [selectedEvents, setSelectedEvents] = useState([]);
  const [deleteAvailabilities] = useMutation(DELETE_SESSIONS);
  const [updateAvailability] = useMutation(CREATE_SESSIONS);
  const { data, loading, error } = useQuery(GET_AVAILABILITY, {
    variables: { userId },
  });
  const { width } = useWindowDimensions();
  const isMobile = getIsMobile(width);

  const availability = get('availability', data);

  const onCreateEvent = ({ startStr, endStr }) => {
    updateAvailability({
      variables: {
        participant1Id: userId,
        status: AVAILABLE,
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
      isMobile ? '' : 'today '
    }prev,next`,
  };

  if (loading) return <Loading />;
  if (error) return null;

  return (
    <section className={cx('calendar')}>
      <div className={cx('instructions')}>{t('instructions')}</div>
      <Calendar
        events={availability}
        duration={isMobile ? 2 : 6}
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
  userType: string.isRequired,
};

export default NativeCalendar;
