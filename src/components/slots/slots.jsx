import React, { useState } from 'react';
import { get, isEmpty, map } from 'lodash/fp';
import { func, string } from 'prop-types';
import { useMutation, useQuery } from '@apollo/client';

import Cta from 'components/cta';
import REQUEST_SESSION from '@graphql/mutations/updateSession.graphql';
import GET_SLOTS from '@graphql/queries/getAvailableSlots.graphql';
import { formatSessionDate, formatSessionTime } from 'helpers/index';
import { REQUESTED } from 'constants/user';

import styles from './slots.module.scss';

const mapWithKey = map.convert({ cap: false });

const Slots = ({ language, userId, onSelect }) => {
  const [sessionRequested, setSessionRequested] = useState(false);
  const { data, loading, error } = useQuery(GET_SLOTS);
  const [requestSession] = useMutation(REQUEST_SESSION);
  const availableSlots = get('availableSlots', data);

  const handleOnClick = (sessionId) => {
    requestSession({
      variables: {
        participant2Id: userId,
        sessionId,
        status: REQUESTED,
      },
    }).then(() => {
      console.log('session requested');
      onSelect();
      setSessionRequested(true);
    });
  };

  if (loading) return null;

  if (error || isEmpty(availableSlots))
    return (
      <div className={styles.container}>
        No Available Slots. Check back here in the next few days. We are working
        hard to partner with more Retirement homes and native speakers.
      </div>
    );
  else {
    let slots = {};
    availableSlots.forEach((slot) => {
      if (!slot) return;
      const date = slot.start.split('T')[0];
      slots[date] = slots[date] ? [...slots[date], slot] : [slot];
    });

    return (
      <div className={styles.container}>
        <h2 className={styles.instruction}>
          Request a session below by clicking on a time slot
        </h2>
        <div className={styles.note}>
          Note: only one session can be requested at a time. Please choose a
          time slot that you can definitely commit to. You will receive an
          answer to your request in good time.
        </div>
        {mapWithKey((dateSlots, key) => {
          const date = formatSessionDate(key, language);

          return (
            <div key={key} className={styles.dateContainer}>
              <h3 className={styles.date}>{date}</h3>
              <div className={styles.slots}>
                {dateSlots.map((slot) => (
                  <Cta
                    className={styles.slot}
                    key={slot.id}
                    onClick={() => handleOnClick(slot.id)}
                    type="button"
                    disabled={sessionRequested}
                    text={formatSessionTime(slot)}
                  />
                ))}
              </div>
            </div>
          );
        }, slots)}
      </div>
    );
  }
};

Slots.propTypes = {
  language: string.isRequired,
  onSelect: func.isRequired,
  userId: string.isRequired,
};

export default Slots;
