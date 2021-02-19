import React from 'react';
import { useTranslation } from 'react-i18next';

import styles from './hero.module.scss';

const Hero = () => {
  const { t } = useTranslation('home');

  return (
    <div className={styles.wrapper}>
      <div className={styles.hero}>
        <div className={styles.content}>{t('description')}</div>
      </div>
    </div>
  );
};

export default Hero;
