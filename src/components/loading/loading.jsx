import React from 'react';
import classnames from 'classnames/bind';

import Logo from 'assets/loading.svg';
import styles from './loading.module.scss';
const cx = classnames.bind(styles);

const Loading = () => {
  return (
    <div className={cx('wrapper')}>
      <Logo className={cx('logo')} />
    </div>
  );
};

export default Loading;
