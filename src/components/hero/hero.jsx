import React from 'react';
import classnames from 'classnames/bind';
import { useTranslation } from 'next-i18next';
import { GERMAN } from '@constants/defaultOptions';

import Logo from 'assets/miteinanderEggshell.svg';
import Text, { HEADING_2, HEADING_6 } from 'components/text';
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
        <Text
          className={cx('content', { german: language === GERMAN })}
          tag="h2"
          type={HEADING_2}
        >
          {t('description')}
        </Text>
        <div className={cx('comingSoon')}>
          <Logo className={cx('logo')} />
          <Text className={cx('text')} tag="h5" type={HEADING_6}>
            {t('comingSoon')}
          </Text>
        </div>
      </div>
    </div>
  );
};

export default Hero;
