import React, { useCallback, useEffect, useState } from 'react';
import classnames from 'classnames/bind';
import { useTranslation } from 'next-i18next';

import Cta from 'components/cta';
import Modal from 'components/modal';
import Text, { HEADING_4 } from 'components/text';
import { sessionProps, withSessionContext } from 'context/session';

import styles from './consentLayer.module.scss';
const cx = classnames.bind(styles);

const ConsentLayer = ({ session }) => {
  const { t } = useTranslation('common', { keyPrefix: 'consentLayer' });
  const [mounted, setMounted] = useState(false);
  const { consentRecorded, onConsentSelection } = session;

  const onConfirm = useCallback(() => {
    window.OneTrust.AllowAll();
    onConsentSelection(true);
  });

  // const onReject = useCallback(() => {
  //   window.OneTrust.RejectAll();
  //   onConsentSelection(false);
  // });

  const onClose = useCallback(() => {
    window.OneTrust.Close();
    onConsentSelection(true);
  });

  const openSettings = useCallback(() => {
    window.OneTrust.ToggleInfoDisplay();
  });

  useEffect(() => {
    if (!consentRecorded && window) setMounted(true);
  }, [consentRecorded]);

  if (!mounted || consentRecorded) return null;

  return (
    <Modal
      className={cx('consentLayer')}
      open={!consentRecorded}
      onClose={onClose}
    >
      <div className={cx('container')}>
        <div className={cx('text')}>
          <Text className={cx('heading')} tag="h3" type={HEADING_4}>
            {t('heading')}
          </Text>
          <Text className={cx('description')}>{t('description')}</Text>
        </div>
        <div className={cx('actions')}>
          <Cta
            className={cx('confirmCta')}
            fullWidth
            outline
            text={t('confirmBtn')}
            onClick={onConfirm}
            disabled={false}
          />
          <Cta
            className={cx('rejectCta')}
            fullWidth
            onClick={openSettings}
            text={t('cookieSettings')}
            disabled={false}
          />
          {/* <Cta
            className={cx('rejectCta')}
            fullWidth
            onClick={onReject}
            text={t('reject')}
            disabled={false}
          /> */}
        </div>
      </div>
    </Modal>
  );
};

ConsentLayer.propTypes = {
  session: sessionProps,
};

export default withSessionContext(ConsentLayer);
