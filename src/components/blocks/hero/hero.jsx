import React from 'react';
import classnames from 'classnames/bind';
import { useTranslation } from 'next-i18next';
import { GERMAN } from '@constants/defaultOptions';

import Logo from 'assets/miteinanderEggshell.svg';
import Text, { HEADING_2 } from 'components/atoms/text';
import styles from './hero.module.scss';
const cx = classnames.bind(styles);

const ROUTE_LITTLE_WORLD = 'https://home.little-world.com/';

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
          bold
        >
          {t('description')}
        </Text>
        <a className={cx('cta')} href={ROUTE_LITTLE_WORLD}>
          {t('heroCta')}
        </a>
        <div className={cx('subContent')}>
          <Logo className={cx('logo')} />
        </div>
      </div>
    </div>
  );
};

export default Hero;
