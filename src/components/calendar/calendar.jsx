import React, { useState } from 'react';
import classnames from 'classnames/bind';
import { useMutation, useQuery } from '@apollo/client';
import FullCalendar from '@fullcalendar/react';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import { useTranslation } from 'next-i18next';
import { any, string } from 'prop-types';
import { get } from 'lodash/fp';

import Loading from 'components/loading';
import GET_AVAILABILITY from '@graphql/queries/getSessions.graphql';
import CREATE_SESSIONS from '@graphql/mutations/createSession.graphql';
import DELETE_SESSIONS from '@graphql/mutations/deleteSessions.graphql';
import { BLUE, GREEN, GREY, RED } from 'constants/colors';
import { AVAILABLE, BOOKED, REQUESTED, REJECTED } from 'constants/user';

import styles from './calendar.module.scss';
const cx = classnames.bind(styles);

const SELECTED = 'SELECTED';
const DELETE_SELECTED = 'deleteSelected';
const MIN_TIME = '09:00:00';
const MAX_TIME = '21:00:00';
const GET_SESSIONS_QUERY = 'GetSessions';

const getEventColor = status => {
  switch (status) {
    case AVAILABLE:
      return GREEN;
    case BOOKED:
      return BLUE;
    case SELECTED:
      return RED;
    case REQUESTED:
    default:
      return GREY;
  }
};

const formatEvents = (events, selectedEvents) =>
  events.map(event => {
    const isSelected = selectedEvents.includes(event.id);
    const eventColor = getEventColor(isSelected ? SELECTED : event.status);
    return { ...event, backgroundColor: eventColor, borderColor: eventColor };
  });

const Calendar = ({ userId }) => {
  const {
    i18n: { language },
    t,
  } = useTranslation('calendar');

  const [selectedEvents, setSelectedEvents] = useState([]);
  const [deleteAvailabilities] = useMutation(DELETE_SESSIONS);
  const [updateAvailability] = useMutation(CREATE_SESSIONS);
  const { data, loading, error } = useQuery(GET_AVAILABILITY, {
    variables: { participant1Id: userId, notOneOf: [REJECTED] },
  });

  const availability = get('sessions', data);
  const events = availability ? formatEvents(availability, selectedEvents) : [];

  const handleSelectEvent = ({ event }) => {
    const eventId = get('_def.publicId', event);
    if (!eventId) return;

    if (selectedEvents.includes(eventId)) {
      event.setProp('backgroundColor', GREEN);
      setSelectedEvents(prevEvents => {
        const index = prevEvents.indexOf(eventId);
        if (index > -1) {
          prevEvents.splice(index, 1);
          return [...prevEvents];
        }
      });
    } else {
      event.setProp('backgroundColor', RED);
      setSelectedEvents(prevEvents => [...prevEvents, eventId]);
    }
  };

  const onDeleteSelected = () => {
    deleteAvailabilities({
      variables: {
        ids: selectedEvents,
      },
      refetchQueries: [GET_SESSIONS_QUERY],
    }).then(() => setSelectedEvents([]));
  };

  const getHeaderBtns = () =>
    selectedEvents.length
      ? `${DELETE_SELECTED} today prev,next`
      : 'today prev,next';

  if (loading) return <Loading />;
  if (error) return null;

  return (
    <section className={cx('calendar')}>
      <div className={cx('instructions')}>{t('instructions')}</div>
      <FullCalendar
        allDaySlot={false}
        customButtons={{
          deleteSelected: {
            text: t('deleteSelected'),
            click: onDeleteSelected,
          },
        }}
        locale={language}
        editable={true}
        events={events}
        eventColor={GREEN}
        eventClick={handleSelectEvent}
        eventOverlap={false}
        headerToolbar={{
          start: 'title',
          end: getHeaderBtns(),
        }}
        height="auto"
        plugins={[interactionPlugin, timeGridPlugin]}
        initialView="timeGrid"
        selectable={true}
        selectMirror={true}
        unselectAuto={true}
        select={({ startStr, endStr }) => {
          setSelectedEvents([]);
          updateAvailability({
            variables: {
              participant1Id: userId,
              status: AVAILABLE,
              start: startStr,
              end: endStr,
            },
            refetchQueries: [GET_SESSIONS_QUERY],
          });
        }}
        fixedWeekCount={false}
        slotMaxTime={MAX_TIME}
        slotMinTime={MIN_TIME}
        duration={{ days: 7 }}
        validRange={currentDate => {
          const start = new Date(currentDate.valueOf());
          let end = new Date(currentDate.valueOf());
          end.setDate(end.getDate() + 6); // 6 days into the future

          return { start, end };
        }}
      />
    </section>
  );
};

Calendar.propTypes = {
  userId: string.isRequired,
  triggerRefetch: any,
};

export default Calendar;
