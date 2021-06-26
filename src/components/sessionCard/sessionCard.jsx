import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import classnames from 'classnames/bind';
import { oneOf, shape, string } from 'prop-types';
import { useTranslation } from 'next-i18next';

import Cta from 'components/cta';
import ConfirmPopUp from 'components/confirmPopUp';
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
} from 'constants/user';

import styles from './sessionCard.module.scss';
const cx = classnames.bind(styles);

const SessionCard = ({ session, status, userType, userId }) => {
  const {
    i18n: { language },
    t,
  } = useTranslation('session');
  const [modalOpen, setModalOpen] = useState(false);
  const isLearner = userType === LEARNER;
  const isRejected = status === REJECTED;
  const isRequested = status === REQUESTED;

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
      variables: { sessionId: session.id, status: BOOKED },
      refetchQueries,
    }).then(() => setModalOpen(false));
  };

  const handleCancelClick = () => {
    if (status === BOOKED) {
      amendSession({
        variables: {
          sessionId: session.id,
          status: CANCELLED,
          cancellationReason: userType,
          cancelledBy: userId,
        },
        refetchQueries,
      });
    } else {
      amendSession({
        variables: {
          sessionId: session.id,
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
      <div className={cx('title')}>{t(`${userType}.${status}.title`)}</div>
      <div className={cx('date')}>
        {formatSessionDate(session.start, language)}
      </div>
      <div className={cx('time')}>{formatSessionTime(session)}</div>
      {!isLearner && isRequested ? (
        <Cta
          className={cx('confirmCta')}
          fullWidth
          onClick={() => setModalOpen(true)}
          type="button"
          disabled={false}
          text={t(`${userType}.${status}.confirmCta`)}
        />
      ) : (
        <i className={cx('moreInfo')}>{t(`${userType}.${status}.moreInfo`)}</i>
      )}
      {!isRejected && (
        <Cta
          className={cx('cancelCta')}
          fullWidth
          onClick={handleCancelClick}
          type="button"
          disabled={false}
          text={t(`${userType}.${status}.cancelCta`)}
        />
      )}
      <ConfirmPopUp
        handleConfirmClick={handleConfirmClick}
        modalOpen={modalOpen}
        namespace={userType}
        setModalOpen={setModalOpen}
        t={t}
      />
    </div>
  );
};

SessionCard.defaultProps = {
  hideCta: false,
  session: {
    description: null,
    start: null,
    end: null,
  },
  userId: null,
};

SessionCard.propTypes = {
  session: shape({
    description: string,
    start: string,
    end: string,
  }),
  status: oneOf([BOOKED, CANCELLED, REJECTED, REQUESTED]).isRequired,
  userType: oneOf([LEARNER, NATIVE]).isRequired,
  userId: string,
};

export default SessionCard;
