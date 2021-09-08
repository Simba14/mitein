import React from 'react';
import { useTranslation } from 'next-i18next';

import Logo from 'assets/miteinanderEggshell.svg';
import styles from './hero.module.scss';

const Hero = () => {
  const { t } = useTranslation('home');

  return (
    <div className={styles.wrapper}>
      <div className={styles.hero}>
        <h2 className={styles.content}>{t('description')}</h2>
        <div className={styles.comingSoon}>
          <Logo className={styles.logo} />
          <h5 className={styles.text}>{t('comingSoon')}</h5>
        </div>
      </div>
    </div>
  );
};

export default Hero;
