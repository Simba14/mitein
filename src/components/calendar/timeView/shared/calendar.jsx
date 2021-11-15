import React, { useState } from 'react';
import classnames from 'classnames/bind';
import FullCalendar from '@fullcalendar/react';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import { useTranslation } from 'next-i18next';
import { any, arrayOf, func, number, string } from 'prop-types';
import { get } from 'lodash/fp';

import { BLUE, GREEN, GREY, RED } from 'constants/colors';
import { AVAILABLE, BOOKED, REQUESTED } from 'constants/user';

import styles from './calendar.module.scss';
const cx = classnames.bind(styles);

const DURATION_DEFAULT = 7;
const SELECTED = 'SELECTED';
export const DELETE_SELECTED = 'deleteSelected';
const MIN_TIME = '09:00:00';
const MAX_TIME = '21:00:00';

const getEventColor = status => {
  switch (status) {
    case AVAILABLE:
      return GREEN;
    case BOOKED:
      return BLUE;
    case SELECTED:
      return RED;
    case REQUESTED:
      return GREY;
    default:
      return GREEN;
  }
};

const formatEvents = (events, selectedEvents) =>
  events.map(event => {
    const isSelected = selectedEvents.includes(event.id);
    const eventColor = getEventColor(isSelected ? SELECTED : event.status);
    return { ...event, backgroundColor: eventColor, borderColor: eventColor };
  });

const Calendar = ({
  duration,
  events,
  initialDate,
  onDelete,
  onCreateEvent,
  refetchQueries,
  selectedEvents,
  setSelectedEvents,
  ...rest
}) => {
  const {
    i18n: { language },
    t,
  } = useTranslation('calendar');

  const formattedEvents = events ? formatEvents(events, selectedEvents) : [];

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

  const handleCreateEvent = event => {
    setSelectedEvents([]);
    onCreateEvent(event);
  };

  const handleDeleteSelected = () => {
    onDelete({
      variables: {
        ids: selectedEvents,
      },
      refetchQueries,
    }).then(() => setSelectedEvents([]));
  };

  const getValidRange = currentDate => {
    const startDate = initialDate || currentDate.valueOf();
    const endDistance = initialDate ? 7 : 6;
    const start = new Date(startDate);
    let end = new Date(startDate);
    end.setDate(end.getDate() + endDistance); // 6 days into the future

    return { start, end };
  };

  return (
    <div className={cx('calendar')}>
      <FullCalendar
        allDaySlot={false}
        customButtons={{
          deleteSelected: {
            text: t('deleteSelected'),
            click: handleDeleteSelected,
          },
        }}
        duration={{ days: duration }}
        editable={true}
        eventClick={handleSelectEvent}
        eventColor={GREEN}
        eventOverlap={false}
        events={formattedEvents}
        fixedWeekCount={false}
        height="auto"
        initialDate={initialDate}
        initialView="timeGrid"
        locale={language}
        plugins={[interactionPlugin, timeGridPlugin]}
        select={handleCreateEvent}
        selectMirror={true}
        selectable={true}
        slotMaxTime={MAX_TIME}
        slotMinTime={MIN_TIME}
        unselectAuto={true}
        validRange={getValidRange}
        {...rest}
      />
    </div>
  );
};

Calendar.propTypes = {
  duration: number,
  events: any,
  initialDate: string,
  onDelete: func.isRequired,
  onCreateEvent: func.isRequired,
  refetchQueries: arrayOf(string),
  selectedEvents: arrayOf(any).isRequired,
  setSelectedEvents: func.isRequired,
};

Calendar.defaultProps = {
  duration: DURATION_DEFAULT,
  initialDate: null,
  refetchQueries: null,
};

export default Calendar;
