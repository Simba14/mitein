import React from 'react';

import classnames from 'classnames/bind';
import { bool, func, oneOfType, string } from 'prop-types';

import Cta from 'components/cta';
import Modal from 'components/modal';

import styles from './confirmPopUp.module.scss';
const cx = classnames.bind(styles);

const TITLE_ID = 'confirmPopUpTitle';
const DESC_ID = 'confirmPopUpTitle';

const ConfirmPopUp = ({
  error,
  handleConfirmClick,
  modalOpen,
  namespace,
  setModalOpen,
  t,
}) => {
  if (!modalOpen) return null;

  return (
    <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
      <div
        role="dialog"
        className={cx('modal')}
        aria-labelledby={TITLE_ID}
        aria-describedby={DESC_ID}
      >
        <h3 id={TITLE_ID} className={cx('heading')}>
          {t(`${namespace}.modal.title`)}
        </h3>
        <div id={DESC_ID} className={cx('disclaimer')}>
          {t(`${namespace}.modal.disclaimer`)}
        </div>
        <Cta
          className={cx('cta')}
          fullWidth
          onClick={handleConfirmClick}
          text={t(`${namespace}.modal.cta`)}
          disabled={Boolean(error)}
        />
        {error && (
          <div role="alert" className={cx('error')}>
            {error}
          </div>
        )}
      </div>
    </Modal>
  );
};

ConfirmPopUp.propTypes = {
  error: string,
  handleConfirmClick: func.isRequired,
  modalOpen: oneOfType([bool, string]).isRequired,
  namespace: string.isRequired,
  setModalOpen: func.isRequired,
  t: func.isRequired,
};

export default ConfirmPopUp;
