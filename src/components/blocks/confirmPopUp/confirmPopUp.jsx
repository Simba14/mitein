import React from 'react';
import { useTranslation } from 'next-i18next';
import classnames from 'classnames/bind';
import { bool, func, oneOfType, string } from 'prop-types';

import Cta from 'components/atoms/cta';
import Modal from 'components/atoms/modal';
import Text, { BODY_6, HEADING_4 } from 'components/atoms/text';

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
}) => {
  const { t } = useTranslation('chat');
  if (!modalOpen) return null;

  return (
    <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
      <div
        role="dialog"
        className={cx('modal')}
        aria-labelledby={TITLE_ID}
        aria-describedby={DESC_ID}
      >
        <Text id={TITLE_ID} className={cx('heading')} tag="h3" type={HEADING_4}>
          {t(`${namespace}.modal.title`)}
        </Text>
        <Text id={DESC_ID} className={cx('disclaimer')}>
          {t(`${namespace}.modal.disclaimer`)}
        </Text>
        <Cta
          className={cx('cta')}
          fullWidth
          onClick={handleConfirmClick}
          text={t(`${namespace}.modal.cta`)}
          disabled={Boolean(error)}
        />
        {error && (
          <Text role="alert" className={cx('error')} type={BODY_6}>
            {error}
          </Text>
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
};

export default ConfirmPopUp;
