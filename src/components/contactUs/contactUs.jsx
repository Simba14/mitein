import React from 'react';
import { string } from 'prop-types';
import { useTranslation } from 'next-i18next';
import classnames from 'classnames/bind';

import styles from './contactUs.module.scss';
const cx = classnames.bind(styles);

const ContactUs = ({ className, translation }) => {
  const { t } = useTranslation(translation);
  return (
    <div className={cx('contactUs', className)}>
      {t('contactUs.descriptor')}
      <br />
      <span className={cx('email')}>
        {t('contactUs.text')}
        <a href={`mailto: ${t('contactUs.email')}`}>{t('contactUs.email')}</a>
      </span>
    </div>
  );
};

ContactUs.propTypes = {
  className: string,
  translation: string.isRequired,
};

export default ContactUs;
