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
  AVAILABLE,
  BOOKED,
  CANCELLED,
  REQUESTED,
  REJECTED,
  LEARNER,
  NATIVE,
} from '@constants/user';

import styles from './chatCard.module.scss';

const cx = classnames.bind(styles);

const ChatCard = ({ chat, status, userType, userId }) => {
  const {
    i18n: { language },
    t,
  } = useTranslation('chat');
  const [modalOpen, setModalOpen] = useState(false);
  const isLearner = userType === LEARNER;
  const isBooked = status === BOOKED;
  const isRejected = status === REJECTED;
  const isRequested = status === REQUESTED;
  const { id, ...chatFields } = chat;

  const refetchQueries = [
    ...(isLearner
      ? []
      : [
          {
            query: GET_AVAILABILITY,
            variables: { participant1Id: userId, notOneOf: [REJECTED] },
          },
        ]),
    {
      query: GET_PROFILE,
      variables: { id: userId },
    },
  ];

  const [amendChat, mutationStatus] = useMutation(UPDATE_CHAT, {
    onError: error => {
      setModalOpen(false);
      toast.error(error?.message);
      mutationStatus.client.refetchQueries({ include: refetchQueries });
    },
  });

  const handleConfirmClick = () => {
    amendChat({
      variables: {
        id,
        ...chatFields,
        status: BOOKED,
      },
      refetchQueries,
    }).then(() => setModalOpen(false));
  };

  const handleCancelClick = () => {
    if (isBooked) {
      amendChat({
        variables: {
          id,
          ...chatFields,
          status: CANCELLED,
          cancellationReason: userType,
          cancelledBy: userId,
        },
        refetchQueries,
      });
    } else {
      amendChat({
        variables: {
          id,
          ...chatFields,
          ...(isLearner
            ? {
                status: AVAILABLE,
                participant2Id: null,
              }
            : { status: REJECTED }),
        },
        refetchQueries,
      });
    }
  };

  return (
    <div className={cx('chat', { unavailable: isRejected })}>
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
          onClick={() => setModalOpen(true)}
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
      {!isRejected && (
        <Cta
          className={cx('cancelCta')}
          fullWidth
          onClick={handleCancelClick}
          disabled={false}
          text={t(`${userType}.${status}.cancelCta`)}
        />
      )}
      <ConfirmPopUp
        handleConfirmClick={handleConfirmClick}
        modalOpen={modalOpen}
        namespace={userType}
        setModalOpen={setModalOpen}
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
  status: oneOf([BOOKED, CANCELLED, REJECTED, REQUESTED]).isRequired,
  userType: oneOf([LEARNER, NATIVE]).isRequired,
  userId: string,
};

export default ChatCard;
