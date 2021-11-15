import React, { useState } from 'react';
import { get, isEmpty, map } from 'lodash/fp';
import { func, string } from 'prop-types';
import { useRouter } from 'next/router';
import { useMutation, useQuery } from '@apollo/client';
import { useTranslation } from 'next-i18next';
import classnames from 'classnames/bind';

import Cta from 'components/cta';
import ConfirmPopUp from 'components/confirmPopUp';
import DayViewCalendar from 'components/calendar/dayView';
import REQUEST_SESSION from '@graphql/mutations/updateSession.graphql';
import GET_SLOTS from '@graphql/queries/getAvailableSlots.graphql';
import { formatSessionDate, formatSessionTime } from 'helpers/index';
import { LEARNER, REQUESTED } from 'constants/user';
import { ROUTE_PROFILE } from 'routes';

import styles from './slots.module.scss';
const cx = classnames.bind(styles);

map.convert({ cap: false });

const Slots = ({ userId, onSelect }) => {
  const {
    i18n: { language },
    t,
  } = useTranslation('session', { keyPrefix: 'slots' });

  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSession, selectSession] = useState(null);
  const [sessionRequested, setSessionRequested] = useState(false);
  const [requestSessionError, setRequestSessionError] = useState(null);

  const { data, loading, error: getSlotsError } = useQuery(GET_SLOTS);
  const [requestSession] = useMutation(REQUEST_SESSION);
  const availableSlots = get('availableSlots', data);

  const handleConfirmClick = () => {
    requestSession({
      variables: {
        ...selectedSession,
        participant2Id: userId,
        status: REQUESTED,
      },
    })
      .then(() => {
        router.push(ROUTE_PROFILE);
        onSelect();
        selectSession(null);
        setSessionRequested(true);
        setSelectedDate(null);
      })
      .catch(e => {
        onSelect();
        setRequestSessionError(get('graphqlErrors[0].message', e) || e.message);
      });
  };

  if (loading) return null;

  if (getSlotsError || isEmpty(availableSlots))
    return (
      <div className={cx('noneAvailable')}>
        <h3 className={cx('noneAvailableTitle')}>{t('noneAvailable')}</h3>
        <div>{t('checkBack')}</div>
      </div>
    );
  else {
    let slots = {};
    availableSlots.forEach(slot => {
      if (!slot) return;
      const date = slot.start.split('T')[0];
      slots[date] = slots[date] ? [...slots[date], slot] : [slot];
    });

    return (
      <div className={cx('container')}>
        <div className={cx('note')}>{t('note')}</div>
        <section className={cx('selectionContainer')}>
          <div className={cx('calendar')}>
            <h3 className={cx('step')}>{t('step1')}</h3>
            <DayViewCalendar
              locale={language}
              onClick={setSelectedDate}
              selectedDate={selectedDate}
              slots={slots}
            />
          </div>
          <div className={cx('requestSlot')}>
            <div className={cx('step2Container')}>
              <h3 className={cx('step')}>{t('step2Number')}</h3>
              <h3 className={cx('step')}>
                {t('step2', {
                  date:
                    selectedDate &&
                    ` for ${formatSessionDate(selectedDate, language)}`,
                })}
              </h3>
            </div>
            {selectedDate ? (
              <div className={cx('slots')}>
                {slots[selectedDate].map(slot => (
                  <Cta
                    className={cx('slot')}
                    key={slot.id}
                    onClick={() => selectSession(slot)}
                    disabled={Boolean(sessionRequested)}
                    text={formatSessionTime({
                      start: slot.start,
                      end: slot.end,
                    })}
                  />
                ))}
              </div>
            ) : (
              <div>{t('noAvailability')}</div>
            )}
          </div>
        </section>
        <ConfirmPopUp
          error={requestSessionError}
          handleConfirmClick={handleConfirmClick}
          modalOpen={Boolean(selectedSession)}
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
