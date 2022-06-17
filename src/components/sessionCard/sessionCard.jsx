import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import classnames from 'classnames/bind';
import { oneOf, shape, string } from 'prop-types';
import { useTranslation } from 'next-i18next';

import Anchor from 'components/anchor';
import Cta from 'components/cta';
import ConfirmPopUp from 'components/confirmPopUp';
import Text, { BODY_3, BODY_6 } from 'components/text';
import UPDATE_SESSION from '@graphql/mutations/updateSession.graphql';
import GET_AVAILABILITY from '@graphql/queries/getSessions.graphql';
import GET_PROFILE from '@graphql/queries/getProfile.graphql';
import { formatSessionDate, formatSessionTime } from 'helpers/index';
import {
  AVAILABLE,
  BOOKED,
  CANCELLED,
  REQUESTED,
  REJECTED,
  LEARNER,
  NATIVE,
} from '@constants/user';

import styles from './sessionCard.module.scss';
const cx = classnames.bind(styles);

const SessionCard = ({ session, status, userType, userId }) => {
  const {
    i18n: { language },
    t,
  } = useTranslation('session');
  const [modalOpen, setModalOpen] = useState(false);
  const isLearner = userType === LEARNER;
  const isBooked = status === BOOKED;
  const isRejected = status === REJECTED;
  const isRequested = status === REQUESTED;
  const { id, ...sessionFields } = session;

  const [amendSession] = useMutation(UPDATE_SESSION);

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

  const handleConfirmClick = () => {
    amendSession({
      variables: {
        id,
        ...sessionFields,
        status: BOOKED,
      },
      refetchQueries,
    }).then(() => setModalOpen(false));
  };

  const handleCancelClick = () => {
    if (isBooked) {
      amendSession({
        variables: {
          id,
          ...sessionFields,
          status: CANCELLED,
          cancellationReason: userType,
          cancelledBy: userId,
        },
        refetchQueries,
      });
    } else {
      amendSession({
        variables: {
          id,
          ...sessionFields,
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
    <div className={cx('session', { unavailable: isRejected })}>
      <Text className={cx('title')} type={BODY_3}>
        {t(`${userType}.${status}.title`)}
      </Text>
      <Text className={cx('date')} type={BODY_6}>
        {formatSessionDate(session.start, language)}
      </Text>
      <Text className={cx('time')} type={BODY_6}>
        {formatSessionTime({
          start: session.start,
          end: session.end,
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
          href={session.link}
          className={cx('link')}
          target="_blank"
          rel="noreferrer"
          underlined
        >
          {t('sessionLink')}
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

SessionCard.defaultProps = {
  hideCta: false,
  userId: null,
};

SessionCard.propTypes = {
  session: shape({
    id: string.isRequired,
    link: string,
    start: string,
    end: string,
  }).isRequired,
  status: oneOf([BOOKED, CANCELLED, REJECTED, REQUESTED]).isRequired,
  userType: oneOf([LEARNER, NATIVE]).isRequired,
  userId: string,
};

export default SessionCard;
