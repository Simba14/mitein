import React from 'react';
import { useTranslation } from 'next-i18next';

import Logo from 'assets/miteinanderEggshell.svg';
import styles from './hero.module.scss';

const Hero = () => {
  const { t } = useTranslation('home');

  return (
    <div className={styles.wrapper}>
      <div className={styles.hero}>
        <div className={styles.content}>{t('description')}</div>
        <div className={styles.comingSoon}>
          <Logo className={styles.logo} />
          <h4>{t('comingSoon')}</h4>
        </div>
      </div>
    </div>
  );
};

export default Hero;
