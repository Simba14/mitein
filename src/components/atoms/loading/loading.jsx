import React from 'react';
import classnames from 'classnames/bind';

import Logo from 'assets/loading.svg';
import styles from './loading.module.scss';
const cx = classnames.bind(styles);

export const LOADING_RING_ID = 'loadingRing';

export const LoadingLogo = () => {
  return (
    <div className={cx('wrapper')}>
      <Logo className={cx('logo')} />
    </div>
  );
};

export const LoadingRing = () => (
  <div className={cx('loadingRing')} data-testid={LOADING_RING_ID}>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
  </div>
);
