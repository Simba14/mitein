import React, { useEffect, useState } from 'react';
import classnames from 'classnames/bind';
import { useTranslation } from 'next-i18next';

import Cta from 'components/cta';
import Modal from 'components/modal';
import { sessionProps, withSessionContext } from 'context/session';

import styles from './consentLayer.module.scss';
const cx = classnames.bind(styles);

const ConsentLayer = ({ session }) => {
  const { t } = useTranslation('common', { keyPrefix: 'consentLayer' });
  const [mounted, setMounted] = useState(false);
  const { consentRecorded, onConsentSelection } = session;

  useEffect(() => {
    if (!consentRecorded) setMounted(true);
  }, [consentRecorded]);

  if (!mounted || consentRecorded) return null;
  return (
    <Modal
      className={cx('consentLayer')}
      open={!consentRecorded}
      onClose={() => null}
    >
      <div className={cx('container')}>
        <div className={cx('text')}>
          <h3 className={cx('heading')}>{t('heading')}</h3>
          <div className={cx('description')}>{t('description')}</div>
        </div>
        <div className={cx('actions')}>
          <Cta
            className={cx('confirmCta')}
            fullWidth
            outline
            text={t('confirmBtn')}
            onClick={() => onConsentSelection(true)}
            disabled={false}
          />
          <Cta
            className={cx('rejectCta')}
            fullWidth
            onClick={() => onConsentSelection(false)}
            text={t('reject')}
            disabled={false}
          />
        </div>
      </div>
    </Modal>
  );
};

ConsentLayer.propTypes = {
  session: sessionProps,
};

export default withSessionContext(ConsentLayer);
