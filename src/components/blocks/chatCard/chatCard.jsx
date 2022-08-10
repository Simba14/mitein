import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import classnames from 'classnames/bind';
import { oneOf, shape, string } from 'prop-types';
import { useTranslation } from 'next-i18next';
import { toast } from 'react-toastify';

import Anchor from 'components/atoms/anchor';
import Cta from 'components/atoms/cta';
import ConfirmPopUp from 'components/blocks/confirmPopUp';
import Text, { BODY_3, BODY_6 } from 'components/atoms/text';
import UPDATE_CHAT from '@graphql/mutations/updateChat.graphql';
import GET_AVAILABILITY from '@graphql/queries/getChats.graphql';
import GET_PROFILE from '@graphql/queries/getProfile.graphql';
import { formatChatDate, formatChatTime } from 'helpers/index';
import {
  CHAT_STATUS_AVAILABLE,
  CHAT_STATUS_BOOKED,
  CHAT_STATUS_CANCELLED,
  CHAT_STATUS_REQUESTED,
  CHAT_STATUS_REJECTED,
  USER_TYPE_LEARNER,
  USER_TYPE_NATIVE,
} from '@api/firebase/constants';

import styles from './chatCard.module.scss';

const cx = classnames.bind(styles);

const ChatCard = ({ chat, status, userType, userId }) => {
  const {
    i18n: { language },
    t,
  } = useTranslation('chat', 'errors');
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const isLearner = userType === USER_TYPE_LEARNER;
  const isBooked = status === CHAT_STATUS_BOOKED;
  const isDenied =
    status === CHAT_STATUS_REJECTED || status === CHAT_STATUS_CANCELLED;
  const isRequested = status === CHAT_STATUS_REQUESTED;
  const { id, ...chatFields } = chat;

  const refetchQueries = [
    ...(isLearner
      ? []
      : [
          {
            query: GET_AVAILABILITY,
            variables: {
              participant1Id: userId,
              notOneOf: [CHAT_STATUS_REJECTED],
            },
          },
        ]),
    {
      query: GET_PROFILE,
      variables: { id: userId },
    },
  ];

  const [amendChat, mutationStatus] = useMutation(UPDATE_CHAT, {
    onError: error => {
      setConfirmModalOpen(false);
      setCancelModalOpen(false);
      toast.error(t(error?.message, { ns: 'errors' }));
      mutationStatus.client.refetchQueries({ include: refetchQueries });
    },
  });

  const handleConfirmClick = () => {
    amendChat({
      variables: {
        id,
        ...chatFields,
        status: CHAT_STATUS_BOOKED,
      },
      refetchQueries,
    }).then(() => setConfirmModalOpen(false));
  };

  const handleCancelClick = () => {
    if (isBooked) {
      amendChat({
        variables: {
          id,
          ...chatFields,
          status: CHAT_STATUS_CANCELLED,
          cancellationReason: userType,
          cancelledBy: userId,
        },
        refetchQueries,
      }).then(() => setCancelModalOpen(false));
    } else {
      amendChat({
        variables: {
          id,
          ...chatFields,
          ...(isLearner
            ? {
                status: CHAT_STATUS_AVAILABLE,
                participant2Id: null,
              }
            : { status: CHAT_STATUS_REJECTED }),
        },
        refetchQueries,
      }).then(() => setCancelModalOpen(false));
    }
  };

  const onCancelClick = () => {
    if (isRequested) {
      handleCancelClick();
    } else {
      setCancelModalOpen(true);
    }
  };

  return (
    <div className={cx('chat', { unavailable: isDenied })}>
      <Text className={cx('title')} type={BODY_3}>
        {t(`${userType}.${status}.title`)}
      </Text>
      <Text className={cx('date')} type={BODY_6}>
        {formatChatDate(chat.start, language)}
      </Text>
      <Text className={cx('time')} type={BODY_6}>
        {formatChatTime({
          start: chat.start,
          end: chat.end,
          language,
        })}
      </Text>

      {!isLearner && isRequested ? (
        <Cta
          className={cx('confirmCta')}
          fullWidth
          onClick={() => setConfirmModalOpen(true)}
          disabled={false}
          text={t(`${userType}.${status}.confirmCta`)}
        />
      ) : (
        <Text className={cx('moreInfo')} tag="i" type={BODY_6}>
          {t(`${userType}.${status}.moreInfo`)}
        </Text>
      )}
      {isBooked && (
        <Anchor
          href={chat.link}
          className={cx('link')}
          target="_blank"
          rel="noreferrer"
          underlined
        >
          {t('chatLink')}
        </Anchor>
      )}
      {!isDenied && (
        <Cta
          className={cx('cancelCta')}
          fullWidth
          onClick={onCancelClick}
          disabled={false}
          text={t(`${userType}.${status}.cancelCta`)}
        />
      )}
      <ConfirmPopUp
        handleConfirmClick={handleConfirmClick}
        modalOpen={confirmModalOpen}
        namespace={`${userType}.modal.confirm`}
        setModalOpen={setConfirmModalOpen}
      />
      <ConfirmPopUp
        handleConfirmClick={handleCancelClick}
        modalOpen={cancelModalOpen}
        namespace={`${userType}.modal.cancel`}
        setModalOpen={setCancelModalOpen}
      />
    </div>
  );
};

ChatCard.defaultProps = {
  hideCta: false,
  userId: null,
};

ChatCard.propTypes = {
  chat: shape({
    id: string.isRequired,
    link: string,
    start: string,
    end: string,
  }).isRequired,
  status: oneOf([
    CHAT_STATUS_BOOKED,
    CHAT_STATUS_CANCELLED,
    CHAT_STATUS_REJECTED,
    CHAT_STATUS_REQUESTED,
  ]).isRequired,
  userType: oneOf([USER_TYPE_LEARNER, USER_TYPE_NATIVE]).isRequired,
  userId: string,
};

export default ChatCard;
