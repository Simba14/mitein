import React, { useState } from 'react';
import classnames from 'classnames/bind';
import { useMutation, useQuery } from '@apollo/client';
import FullCalendar from '@fullcalendar/react';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import { useTranslation } from 'next-i18next';
import { any, string } from 'prop-types';
import { get } from 'lodash/fp';

import Cta from 'components/cta';
import Loading from 'components/loading';
import GET_AVAILABILITY from '@graphql/queries/getAvailability.graphql';
import CREATE_AVAILABILITY from '@graphql/mutations/addAvailability.graphql';
import DELETE_AVAILABILITY from '@graphql/mutations/deleteAvailability.graphql';
import { GREEN, RED } from 'constants/colors';

import styles from './availability.module.scss';
const cx = classnames.bind(styles);

const MIN_TIME = '09:00:00';
const MAX_TIME = '21:00:00';
const GET_AVAILABILITY_QUERY = 'GetAvailability';

const formatEvents = (events, selectedEvents) =>
  events.map(event => {
    const isSelected = selectedEvents.includes(event.id);
    const eventColor = isSelected ? RED : GREEN;
    return { ...event, backgroundColor: eventColor, borderColor: eventColor };
  });

const Calendar = ({ userId }) => {
  const {
    i18n: { language },
    t,
  } = useTranslation('calendar');

  const [selectedEvents, setSelectedEvents] = useState([]);
  const [deleteAvailabilities] = useMutation(DELETE_AVAILABILITY);
  const [updateAvailability] = useMutation(CREATE_AVAILABILITY);
  const { data, loading, error } = useQuery(GET_AVAILABILITY, {
    variables: { userId },
  });

  const availability = get('availability', data);
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
      refetchQueries: [GET_AVAILABILITY_QUERY],
    }).then(() => setSelectedEvents([]));
  };

  if (loading) return <Loading />;
  if (error) return null;

  return (
    <section className={cx('calendar')}>
      <div className={cx('toolbar')}>
        <div>
          <h3 className={cx('title')}>{t('availabilityTitle')}</h3>
          <div className={cx('instructions')}>{t('availabilityNote')}</div>
        </div>
        <Cta
          className={cx('delete')}
          onClick={onDeleteSelected}
          disabled={!selectedEvents.length}
          text={t('deleteSelected')}
        />
      </div>
      <FullCalendar
        allDaySlot={false}
        locale={language}
        dayHeaderFormat={{ weekday: 'long' }}
        editable={true}
        events={events}
        eventColor={GREEN}
        eventClick={handleSelectEvent}
        eventOverlap={false}
        headerToolbar={false}
        height="auto"
        plugins={[interactionPlugin, timeGridPlugin]}
        initialDate="Mon Oct 04 2021"
        initialView="timeGrid"
        selectable={true}
        selectMirror={true}
        unselectAuto={true}
        select={({ startStr, endStr }) => {
          setSelectedEvents([]);
          updateAvailability({
            variables: {
              userId,
              start: startStr,
              end: endStr,
            },
            refetchQueries: [GET_AVAILABILITY_QUERY],
          });
        }}
        slotMaxTime={MAX_TIME}
        slotMinTime={MIN_TIME}
        duration={{ days: 7 }}
        validRange={() => {
          const start = new Date('Mon Oct 04 2021');
          let end = new Date('Mon Oct 04 2021');
          end.setDate(end.getDate() + 7); // 6 days into the future

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
