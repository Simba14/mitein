import React, { useState } from 'react';
import { get, isEmpty, map } from 'lodash/fp';
import { func, string } from 'prop-types';
import { useMutation, useQuery } from '@apollo/client';
import { useTranslation } from 'next-i18next';

import Cta from 'components/cta';
import ConfirmPopUp from 'components/confirmPopUp';
import REQUEST_SESSION from '@graphql/mutations/updateSession.graphql';
import GET_SLOTS from '@graphql/queries/getAvailableSlots.graphql';
import { formatSessionDate, formatSessionTime } from 'helpers/index';
import { LEARNER, REQUESTED } from 'constants/user';

import styles from './slots.module.scss';

const mapWithKey = map.convert({ cap: false });

const Slots = ({ userId, onSelect }) => {
  const {
    i18n: { language },
    t,
  } = useTranslation('session');
  const [selectedSession, selectSession] = useState(null);
  const [sessionRequested, setSessionRequested] = useState(false);
  const { data, loading, error } = useQuery(GET_SLOTS);
  const [requestSession] = useMutation(REQUEST_SESSION);
  const availableSlots = get('availableSlots', data);

  const handleConfirmClick = () => {
    requestSession({
      variables: {
        participant2Id: userId,
        sessionId: selectedSession,
        status: REQUESTED,
      },
    }).then(() => {
      onSelect();
      selectSession(null);
      setSessionRequested(true);
    });
  };

  if (loading) return null;

  if (error || isEmpty(availableSlots))
    return <div className={styles.container}>{t('slots.noneAvailable')}</div>;
  else {
    let slots = {};
    availableSlots.forEach((slot) => {
      if (!slot) return;
      const date = slot.start.split('T')[0];
      slots[date] = slots[date] ? [...slots[date], slot] : [slot];
    });

    return (
      <div className={styles.container}>
        <h2 className={styles.instruction}>{t('slots.instruction')}</h2>
        <div className={styles.note}>{t('slots.note')}</div>
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
                    onClick={() => selectSession(slot.id)}
                    type="button"
                    disabled={sessionRequested}
                    text={formatSessionTime(slot)}
                  />
                ))}
              </div>
            </div>
          );
        }, slots)}
        <ConfirmPopUp
          handleConfirmClick={handleConfirmClick}
          modalOpen={selectedSession}
          namespace={LEARNER}
          setModalOpen={selectSession}
          t={t}
        />
      </div>
    );
  }
};

Slots.propTypes = {
  onSelect: func.isRequired,
  userId: string.isRequired,
};

export default Slots;
