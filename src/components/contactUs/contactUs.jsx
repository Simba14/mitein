import React from 'react';
import { string } from 'prop-types';
import { useTranslation } from 'react-i18next';

import styles from './contactUs.module.scss';

const ContactUs = ({ className, translation }) => {
  const { t } = useTranslation(translation);
  return (
    <div className={`${styles.contactUs} ${className}`}>
      {t('contactUs.descriptor')}
      <br />
      {t('contactUs.text')}
      <a href={`mailto: ${t('contactUs.email')}`}>{t('contactUs.email')}</a>
    </div>
  );
};

ContactUs.propTypes = {
  className: string.isRequired,
  translation: string.isRequired,
};

export default ContactUs;
