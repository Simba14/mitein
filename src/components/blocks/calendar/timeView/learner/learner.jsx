import React, { useState } from 'react';
import classnames from 'classnames/bind';
import { useMutation, useQuery } from '@apollo/client';
import { useTranslation } from 'next-i18next';
import { string } from 'prop-types';
import { get } from 'lodash/fp';

import Calendar, {
  DELETE_SELECTED,
} from 'components/blocks/calendar/timeView/shared';
import Cta from 'components/atoms/cta';
import Loading from 'components/atoms/loading';
import Text, { HEADING_4 } from 'components/atoms/text';
import GET_AVAILABILITY from '@graphql/queries/getAvailability.graphql';
import CREATE_AVAILABILITY from '@graphql/mutations/addAvailability.graphql';
import DELETE_AVAILABILITY from '@graphql/mutations/deleteAvailability.graphql';
import useWindowDimensions from 'hooks/useWindowDimensions';
import { isSpecifiedBreakpoint } from 'helpers/index';
import { TABLET_WIDE } from '@constants/breakpoints';
import { UserType } from '@constants/types';

import styles from './learner.module.scss';

const cx = classnames.bind(styles);

const GET_AVAILABILITY_QUERY = 'GetAvailability';

const LearnerCalendar = ({ userId, userType }) => {
  const { t } = useTranslation('calendar');

  const [selectedEvents, setSelectedEvents] = useState([]);
  const [deleteAvailabilities] = useMutation(DELETE_AVAILABILITY);
  const [updateAvailability] = useMutation(CREATE_AVAILABILITY);
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
        userId,
        start: startStr,
        end: endStr,
        userType,
      },
      refetchQueries: [GET_AVAILABILITY_QUERY],
    });
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

  const headerToolbar = isSmallerViewport
    ? {
        start: selectedEvents.length ? DELETE_SELECTED : '',
        end: 'prev,next',
      }
    : false;

  return (
    <section className={cx('calendar')}>
      <div className={cx('toolbar')}>
        <div>
          <Text className={cx('title')} tag="h3" type={HEADING_4}>
            {t('availabilityTitle')}
          </Text>
          <Text className={cx('instructions')}>{t('availabilityNote')}</Text>
        </div>
        <Cta
          className={cx('delete')}
          onClick={onDeleteSelected}
          disabled={!selectedEvents.length}
          text={t('deleteSelected')}
        />
      </div>
      <Calendar
        dayHeaderFormat={{ weekday: 'long' }}
        duration={isSmallerViewport ? 2 : 7}
        events={availability}
        headerToolbar={headerToolbar}
        initialDate="Mon Oct 04 2021"
        onCreateEvent={onCreateEvent}
        onDelete={deleteAvailabilities}
        refetchQueries={[GET_AVAILABILITY_QUERY]}
        selectedEvents={selectedEvents}
        setSelectedEvents={setSelectedEvents}
      />
    </section>
  );
};

LearnerCalendar.propTypes = {
  userId: string.isRequired,
  userType: UserType.isRequired,
};

export default LearnerCalendar;
