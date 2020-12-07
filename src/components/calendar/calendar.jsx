import React, { useState } from 'react';
import { Query } from '@apollo/react-components';
import { useMutation } from '@apollo/react-hooks';
import FullCalendar from '@fullcalendar/react';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import { useTranslation } from 'react-i18next';
import { string } from 'prop-types';
import { get } from 'lodash/fp';

import GET_AVAILABILITY from 'graphql/queries/getAvailability.graphql';
import UPDATE_AVAILABILITY from 'graphql/mutations/updateAvailability.graphql';
import DELETE_AVAILABILITIES from 'graphql/mutations/deleteAvailabilities.graphql';

import styles from './calendar.module.scss';

const DELETE_SELECTED = 'deleteSelected';
const MIN_TIME = '09:00:00';
const MAX_TIME = '21:00:00';
const GET_AVAILABILITY_QUERY = 'GetAvailability';
const EVENT_COLOR_DEFAULT = '#59ca45';
const EVENT_COLOR_SELECTED = 'red';

const Calendar = ({ userId }) => {
  const {
    i18n: { language },
    t,
  } = useTranslation('calendar');

  const [selectedEvents, setSelectedEvents] = useState([]);
  const [deleteAvailabilities] = useMutation(DELETE_AVAILABILITIES);
  const [updateAvailability] = useMutation(UPDATE_AVAILABILITY);

  const handleSelectEvent = ({ event }) => {
    console.log({ event });
    const eventId = get('_def.publicId', event);
    if (!eventId) return;

    if (selectedEvents.includes(eventId)) {
      event.setProp('backgroundColor', EVENT_COLOR_DEFAULT);
      setSelectedEvents((prevEvents) => {
        const index = prevEvents.indexOf(eventId);
        if (index > -1) {
          prevEvents.splice(index, 1);
          return [...prevEvents];
        }
      });
    } else {
      event.setProp('backgroundColor', EVENT_COLOR_SELECTED);
      setSelectedEvents((prevEvents) => [...prevEvents, eventId]);
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

  const getHeaderBtns = () =>
    selectedEvents.length
      ? `${DELETE_SELECTED} today prev,next`
      : 'today prev,next';

  return (
    <Query query={GET_AVAILABILITY} variables={{ userId }}>
      {({ data, loading, error }) => {
        const availability = get('userAvailability', data);
        // console.log({ data, availability });
        console.log({ availability });
        return (
          <div className={styles.calendar}>
            <FullCalendar
              allDaySlot={true}
              customButtons={{
                deleteSelected: {
                  text: t('deleteSelected'),
                  click: onDeleteSelected,
                },
              }}
              locale={language}
              editable={true}
              events={availability}
              eventClick={handleSelectEvent}
              eventOverlap={false}
              headerToolbar={{
                start: 'title',
                end: getHeaderBtns(),
              }}
              plugins={[interactionPlugin, timeGridPlugin]}
              initialView="timeGrid"
              selectable={true}
              selectMirror={true}
              unselectAuto={true}
              select={({ startStr, endStr }) => {
                // console.log('SELECT', { startStr, endStr });
                setSelectedEvents([]);
                updateAvailability({
                  variables: {
                    user_id: userId,
                    start: startStr,
                    end: endStr,
                  },
                  refetchQueries: [GET_AVAILABILITY_QUERY],
                });
              }}
              slotMaxTime={MAX_TIME}
              slotMinTime={MIN_TIME}
              duration={{ days: 7 }}
              validRange={(currentDate) => {
                const start = new Date(currentDate.valueOf());
                let end = new Date(currentDate.valueOf());
                end.setDate(end.getDate() + 6); // 6 days into the future

                return { start, end };
              }}
            />
          </div>
        );
      }}
    </Query>
  );
};

Calendar.propTypes = {
  userId: string.isRequired,
};

export default Calendar;
