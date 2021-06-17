import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { noop } from 'lodash/fp';
import classnames from 'classnames/bind';
import { func, oneOf, shape, string } from 'prop-types';
import { useTranslation } from 'next-i18next';

import Cta from 'components/cta';
import Modal from 'components/modal';
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

const SessionCard = ({ session, ctaCallback, status, userType, userId }) => {
  const {
    i18n: { language },
    t,
  } = useTranslation('session');
  const [modalOpen, setModalOpen] = useState(false);
  const isLearner = userType === LEARNER;
  const isRejected = status === REJECTED;

  const [amendSession] = useMutation(UPDATE_SESSION);

  const refetchQueries = [
    isLearner
      ? null
      : {
          query: GET_AVAILABILITY,
          variables: { participant1Id: userId, notOneOf: [REJECTED] },
        },
    {
      query: GET_PROFILE,
      variables: { id: userId },
    },
  ];

  const handleConfirmClick = () => {
    amendSession({
      variables: { sessionId: session.id, status: BOOKED },
      refetchQueries,
    }).then(() => {
      // ctaCallback();
    });
  };

  const handleCancelClick = () => {
    if (status === BOOKED) {
      amendSession({
        variables: {
          sessionId: session.id,
          status: CANCELLED,
          cancelledBy: userType,
        },
        refetchQueries,
      }).then(() => {
        // ctaCallback();
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
      }).then(() => {
        // ctaCallback();
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
      {isLearner || isRejected ? (
        <i className={cx('moreInfo')}>{t(`${userType}.${status}.moreInfo`)}</i>
      ) : (
        <Cta
          className={cx('confirmCta')}
          fullWidth
          onClick={() => setModalOpen(true)}
          type="button"
          disabled={false}
          text={t(`${userType}.${status}.confirmCta`)}
        />
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
      {modalOpen && (
        <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
          <div className={cx('modal')}>
            <h3 className={cx('heading')}>{t(`${userType}.modal.title`)}</h3>
            <div className={cx('disclaimer')}>
              {t(`${userType}.modal.disclaimer`)}
            </div>
            <Cta
              className={cx('cta')}
              fullWidth
              onClick={handleConfirmClick}
              type="button"
              disabled={true}
              text={t(`${userType}.modal.cta`)}
            />
          </div>
        </Modal>
      )}
    </div>
  );
};

SessionCard.defaultProps = {
  ctaCallback: noop,
  hideCta: false,
  session: {
    description: null,
    start: null,
    end: null,
  },
  userId: null,
};

SessionCard.propTypes = {
  ctaCallback: func,
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
