import React, { useState } from 'react';
import { get, isEmpty, map } from 'lodash/fp';
import { func, string } from 'prop-types';
import { useMutation, useQuery } from '@apollo/client';
import { useTranslation } from 'next-i18next';
import classnames from 'classnames/bind';
import { toast } from 'react-toastify';

import Cta from 'components/atoms/cta';
import ConfirmPopUp from 'components/blocks/confirmPopUp';
import DayViewCalendar from 'components/blocks/calendar/dayView';
import Notice, { ALERT } from 'components/atoms/notice';
import Text, { BODY_4, HEADING_4 } from 'components/atoms/text';
import REQUEST_CHAT from '@graphql/mutations/updateChat.graphql';
import GET_SLOTS from '@graphql/queries/getAvailableChats.graphql';
import { formatChatDate, formatChatTime } from 'helpers/index';
import {
  USER_TYPE_LEARNER,
  CHAT_STATUS_REQUESTED,
} from '@api/firebase/constants';

import styles from './slots.module.scss';
const cx = classnames.bind(styles);

const DROPDOWN_LABEL = 'timeDropdownLabel';

map.convert({ cap: false });

const Slots = ({
  slotsOfUserId,
  noAvailabilityText,
  requesterId,
  requesterDisplayName,
  onSelect,
}) => {
  const {
    i18n: { language },
    t,
  } = useTranslation(['chat', 'errors']);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedChat, selectChat] = useState(null);
  const [chatRequested, setChatRequested] = useState(false);

  const {
    data,
    loading,
    error: getSlotsError,
    refetch,
  } = useQuery(GET_SLOTS, { variables: { userId: slotsOfUserId } });
  const [requestChat, { loading: loadingRequestChat }] =
    useMutation(REQUEST_CHAT);
  const availableSlots = get('availableChats', data);

  const handleSelectChat = ({ target }) => {
    if (!target.selectedIndex) return;
    const chat = availableSlots.find(slot => slot.id === target.value);
    selectChat(chat);
  };

  const handleConfirmClick = () => {
    requestChat({
      variables: {
        ...selectedChat,
        participant2Id: requesterId,
        participant2Name: requesterDisplayName,
        status: CHAT_STATUS_REQUESTED,
      },
    })
      .then(() => {
        selectChat(null);
        setChatRequested(true);
        setSelectedDate(null);
        onSelect(true);
      })
      .catch(error => {
        selectChat(null);
        setModalOpen(false);
        toast.error(t(error?.message, { ns: 'errors' }));
        onSelect(false);
        refetch();
      });
  };

  const openModal = () => setModalOpen(true);

  if (loading) return null;

  if (getSlotsError || isEmpty(availableSlots))
    return (
      <div className={cx('noneAvailable')}>
        <Text
          className={cx('noneAvailableTitle')}
          tag="h3"
          type={HEADING_4}
          bold
        >
          {noAvailabilityText}
        </Text>
        <Text>{t('slots.checkBack')}</Text>
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
        {slotsOfUserId ? (
          <Text className={cx('description')} type={BODY_4}>
            {t('slots.description')}
          </Text>
        ) : (
          <Notice type={ALERT}>
            <Text>{t('slots.note')}</Text>
          </Notice>
        )}
        <section className={cx('selectionContainer')}>
          <div className={cx('calendar')}>
            <Text className={cx('step')} tag="h3" type={HEADING_4} bold>
              {t('slots.step1')}
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
              <Text className={cx('step')} tag="h3" type={HEADING_4} bold>
                {t('slots.step2Number')}
              </Text>
              <Text
                className={cx('step')}
                tag="h3"
                type={HEADING_4}
                id={DROPDOWN_LABEL}
                bold
              >
                {t('slots.step2', {
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
                  <option value={null}>{t('slots.defaultOption')}</option>
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
                  text={t('slots.cta')}
                />
              </div>
            ) : (
              <div>{t('slots.unavailableDate')}</div>
            )}
          </div>
        </section>
        <ConfirmPopUp
          ctaLoading={loadingRequestChat}
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
  noAvailabilityText: string.isRequired,
  requesterId: string.isRequired,
  slotsOfUserId: string,
  requesterDisplayName: string.isRequired,
};

Slots.defaultProps = {
  slotsOfUserId: null,
};

export default Slots;
