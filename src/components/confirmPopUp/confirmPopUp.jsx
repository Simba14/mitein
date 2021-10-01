import React from 'react';

import classnames from 'classnames/bind';
import { bool, func, oneOfType, string } from 'prop-types';

import Cta from 'components/cta';
import Modal from 'components/modal';

import styles from './confirmPopUp.module.scss';
const cx = classnames.bind(styles);

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
      <div className={cx('modal')}>
        <h3 className={cx('heading')}>{t(`${namespace}.modal.title`)}</h3>
        <div className={cx('disclaimer')}>
          {t(`${namespace}.modal.disclaimer`)}
        </div>
        <Cta
          className={cx('cta')}
          fullWidth
          onClick={handleConfirmClick}
          text={t(`${namespace}.modal.cta`)}
          disabled={error}
        />
        {error && <div className={cx('error')}>{error}</div>}
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
