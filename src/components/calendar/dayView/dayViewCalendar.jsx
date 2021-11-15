import React from 'react';
import classnames from 'classnames/bind';
import FullCalendar from '@fullcalendar/react';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import { any, func, string } from 'prop-types';
import { isEmpty } from 'lodash/fp';

import styles from './dayViewCalendar.module.scss';
const cx = classnames.bind(styles);

const dayHasAvailability = ({ date, slots }) => {
  const offset = date.getTimezoneOffset();
  const dateOffsetForTimezone = new Date(date.getTime() - offset * 60 * 1000);
  const day = dateOffsetForTimezone.toISOString().split('T')[0];
  return !isEmpty(slots[day]);
};

const Calendar = ({ locale, onClick, selectedDate, slots }) => {
  const getValidRange = currentDate => {
    const start = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1,
    );
    const end = new Date(start.getFullYear(), start.getMonth() + 2, 0);
    return { start, end };
  };

  const handleDateClick = ({ date, dateStr, dayEl }) => {
    if (dayHasAvailability({ date, slots })) {
      if (selectedDate)
        document
          .querySelector(`.${cx('daySelected')}`)
          .classList.remove(cx('daySelected'));

      onClick(dateStr);
      dayEl.classList.add(cx('daySelected'));
    }
  };

  const headerToolbar = {
    start: 'title',
    end: 'prev,next',
  };

  return (
    <FullCalendar
      dateClick={handleDateClick}
      height="auto"
      locale={locale}
      eventClick={null}
      eventOverlap={false}
      fixedWeekCount={false}
      showNonCurrentDates={true}
      headerToolbar={headerToolbar}
      initialView="dayGridMonth"
      plugins={[dayGridPlugin, interactionPlugin]}
      dayCellClassNames={({ date }) => {
        return dayHasAvailability({ date, slots })
          ? [cx('dayAvailable')]
          : [cx('dayUnavailable')];
      }}
      validRange={getValidRange}
    />
  );
};

Calendar.propTypes = {
  locale: string.isRequired,
  onClick: func.isRequired,
  selectedDate: string,
  slots: any.isRequired,
};

Calendar.defaultProps = {
  selectedDate: null,
};

export default Calendar;
