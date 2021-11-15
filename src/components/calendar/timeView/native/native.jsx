import React, { useCallback, useState } from 'react';
import classnames from 'classnames/bind';
import { useMutation, useQuery } from '@apollo/client';
import { useTranslation } from 'next-i18next';
import { string } from 'prop-types';
import { get } from 'lodash/fp';

import Calendar, { DELETE_SELECTED } from 'components/calendar/timeView/shared';
import Loading from 'components/loading';
import GET_AVAILABILITY from '@graphql/queries/getSessions.graphql';
import CREATE_SESSIONS from '@graphql/mutations/createSession.graphql';
import DELETE_SESSIONS from '@graphql/mutations/deleteSessions.graphql';
import { AVAILABLE, REJECTED } from 'constants/user';
import useWindowDimensions from 'hooks/useWindowDimensions';
import { getIsMobile } from 'helpers/index';

import styles from './native.module.scss';
const cx = classnames.bind(styles);

const GET_SESSIONS_QUERY = 'GetSessions';

const NativeCalendar = ({ userId }) => {
  const { t } = useTranslation('calendar');

  const [selectedEvents, setSelectedEvents] = useState([]);
  const [deleteAvailabilities] = useMutation(DELETE_SESSIONS);
  const [updateAvailability] = useMutation(CREATE_SESSIONS);
  const { data, loading, error } = useQuery(GET_AVAILABILITY, {
    variables: { participant1Id: userId, notOneOf: [REJECTED] },
  });
  const { width } = useWindowDimensions();
  const isMobile = getIsMobile(width);

  const availability = get('sessions', data);

  const onCreateEvent = ({ startStr, endStr }) => {
    updateAvailability({
      variables: {
        participant1Id: userId,
        status: AVAILABLE,
        start: startStr,
        end: endStr,
      },
      refetchQueries: [GET_SESSIONS_QUERY],
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
        refetchQueries={[GET_SESSIONS_QUERY]}
        selectedEvents={selectedEvents}
        setSelectedEvents={setSelectedEvents}
      />
    </section>
  );
};

NativeCalendar.propTypes = {
  userId: string.isRequired,
};

export default NativeCalendar;
