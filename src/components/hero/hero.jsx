import React from 'react';
import classnames from 'classnames/bind';
import { useTranslation } from 'next-i18next';
import { GERMAN } from '@constants/defaultOptions';

import Logo from 'assets/miteinanderEggshell.svg';
import styles from './hero.module.scss';
const cx = classnames.bind(styles);

const Hero = () => {
  const {
    t,
    i18n: { language },
  } = useTranslation('home');

  return (
    <div className={cx('wrapper')}>
      <div className={cx('hero')}>
        <h2 className={cx('content', { german: language === GERMAN })}>
          {t('description')}
        </h2>
        <div className={cx('comingSoon')}>
          <Logo className={cx('logo')} />
          <h5 className={cx('text')}>{t('comingSoon')}</h5>
        </div>
      </div>
    </div>
  );
};

export default Hero;
