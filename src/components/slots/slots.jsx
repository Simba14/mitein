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
import Text, { HEADING_4 } from 'components/text';
import REQUEST_SESSION from '@graphql/mutations/updateSession.graphql';
import GET_SLOTS from '@graphql/queries/getAvailableSlots.graphql';
import { formatSessionDate, formatSessionTime } from 'helpers/index';
import { LEARNER, REQUESTED } from '@constants/user';
import { ROUTE_PROFILE } from 'routes';

import styles from './slots.module.scss';
const cx = classnames.bind(styles);

const DROPDOWN_LABEL = 'timeDropdownLabel';

map.convert({ cap: false });

const Slots = ({ userId, onSelect }) => {
  const {
    i18n: { language },
    t,
  } = useTranslation('session', { keyPrefix: 'slots' });

  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSession, selectSession] = useState(null);
  const [sessionRequested, setSessionRequested] = useState(false);
  const [requestSessionError, setRequestSessionError] = useState(null);

  const { data, loading, error: getSlotsError } = useQuery(GET_SLOTS);
  const [requestSession] = useMutation(REQUEST_SESSION);
  const availableSlots = get('availableSlots', data);

  const handleSelectSession = ({ target }) => {
    const session = availableSlots.find(slot => slot.id === target.value);
    selectSession(session);
  };

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
        setRequestSessionError(get('graphQLErrors[0].message', e) || e.message);
      });
  };

  if (loading) return null;

  if (getSlotsError || isEmpty(availableSlots))
    return (
      <div className={cx('noneAvailable')}>
        <Text className={cx('noneAvailableTitle')} tag="h3" type={HEADING_4}>
          {t('noneAvailable')}
        </Text>
        <Text>{t('checkBack')}</Text>
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
            <Text className={cx('step')} tag="h3" type={HEADING_4}>
              {t('step1')}
            </Text>
            <DayViewCalendar
              locale={language}
              onClick={setSelectedDate}
              selectedDate={selectedDate}
              slots={slots}
            />
          </div>
          <div className={cx('requestSlot')}>
            <div className={cx('step2Container')}>
              <Text className={cx('step')} tag="h3" type={HEADING_4}>
                {t('step2Number')}
              </Text>
              <Text
                className={cx('step')}
                tag="h3"
                type={HEADING_4}
                id={DROPDOWN_LABEL}
              >
                {t('step2', {
                  date:
                    selectedDate &&
                    ` for ${formatSessionDate(selectedDate, language)}`,
                })}
              </Text>
            </div>
            {selectedDate ? (
              <div className={cx('slots')}>
                <select
                  aria-labelledby={DROPDOWN_LABEL}
                  className={cx('dropdown')}
                  default={slots[selectedDate][0]}
                  disabled={Boolean(sessionRequested)}
                  onSelect={handleSelectSession}
                >
                  {slots[selectedDate].map(slot => (
                    <option
                      key={slot.id}
                      onClick={() => selectSession(slot)}
                      value={slot.id}
                    >
                      {formatSessionTime({ start: slot.start, end: slot.end })}
                    </option>
                  ))}
                </select>
                <Cta
                  className={cx('cta')}
                  fullWidth
                  onClick={() => setModalOpen(true)}
                  disabled={Boolean(sessionRequested)}
                  text={t('cta')}
                />
              </div>
            ) : (
              <div>{t('noAvailability')}</div>
            )}
          </div>
        </section>
        <ConfirmPopUp
          error={requestSessionError}
          handleConfirmClick={handleConfirmClick}
          modalOpen={modalOpen}
          namespace={LEARNER}
          setModalOpen={setModalOpen}
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
