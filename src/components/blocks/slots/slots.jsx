import React, { useState } from 'react';
import { get, isEmpty, map } from 'lodash/fp';
import { func, string } from 'prop-types';
import { useMutation, useQuery } from '@apollo/client';
import { useTranslation } from 'next-i18next';
import classnames from 'classnames/bind';

import Cta from 'components/atoms/cta';
import ConfirmPopUp from 'components/blocks/confirmPopUp';
import DayViewCalendar from 'components/blocks/calendar/dayView';
import Notice, { ALERT } from 'components/atoms/notice';
import Text, { HEADING_4 } from 'components/atoms/text';
import REQUEST_CHAT from '@graphql/mutations/updateChat.graphql';
import GET_SLOTS from '@graphql/queries/getAvailableSlots.graphql';
import { formatChatDate, formatChatTime } from 'helpers/index';
import {
  USER_TYPE_LEARNER,
  CHAT_STATUS_REQUESTED,
} from '@api/firebase/constants';

import styles from './slots.module.scss';
const cx = classnames.bind(styles);

const DROPDOWN_LABEL = 'timeDropdownLabel';

map.convert({ cap: false });

const Slots = ({ userId, userDisplayName, onSelect }) => {
  const {
    i18n: { language },
    t,
  } = useTranslation('chat', { keyPrefix: 'slots' });

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedChat, selectChat] = useState(null);
  const [chatRequested, setChatRequested] = useState(false);
  const [requestChatError, setRequestChatError] = useState(null);

  const { data, loading, error: getSlotsError, refetch } = useQuery(GET_SLOTS);
  const [requestChat] = useMutation(REQUEST_CHAT);
  const availableSlots = get('availableSlots', data);

  const handleSelectChat = ({ target }) => {
    if (!target.selectedIndex) return;
    const chat = availableSlots.find(slot => slot.id === target.value);
    selectChat(chat);
  };

  const handleConfirmClick = () => {
    requestChat({
      variables: {
        ...selectedChat,
        participant2Id: userId,
        participant2Name: userDisplayName,
        status: CHAT_STATUS_REQUESTED,
      },
    })
      .then(() => {
        selectChat(null);
        setChatRequested(true);
        setSelectedDate(null);
        onSelect();
      })
      .catch(e => {
        setRequestChatError(get('graphQLErrors[0].message', e) || e.message);
        selectChat(null);
        onSelect();
        refetch();
      });
  };

  const openModal = () => setModalOpen(true);

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
        <Notice type={ALERT}>
          <Text>{t('note')}</Text>
        </Notice>
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
                    ` for ${formatChatDate(selectedDate, language)}`,
                })}
              </Text>
            </div>
            {selectedDate ? (
              <div className={cx('slots')}>
                <select
                  aria-labelledby={DROPDOWN_LABEL}
                  className={cx('dropdown')}
                  default={slots[selectedDate][0]}
                  disabled={Boolean(chatRequested)}
                  onChange={handleSelectChat}
                >
                  <option value={null}>{t('defaultOption')}</option>
                  {slots[selectedDate].map(slot => (
                    <option
                      key={slot.id}
                      onClick={() => selectChat(slot)}
                      value={slot.id}
                    >
                      {formatChatTime({
                        start: slot.start,
                        end: slot.end,
                        language,
                      })}
                    </option>
                  ))}
                </select>
                <Cta
                  className={cx('cta')}
                  fullWidth
                  onClick={openModal}
                  disabled={Boolean(chatRequested || !selectedChat)}
                  text={t('cta')}
                />
              </div>
            ) : (
              <div>{t('noAvailability')}</div>
            )}
          </div>
        </section>
        <ConfirmPopUp
          error={requestChatError}
          handleConfirmClick={handleConfirmClick}
          modalOpen={modalOpen}
          namespace={`${USER_TYPE_LEARNER}.modal.request`}
          setModalOpen={setModalOpen}
        />
      </div>
    );
  }
};

Slots.propTypes = {
  onSelect: func.isRequired,
  userId: string.isRequired,
  userDisplayName: string.isRequired,
};

export default Slots;
