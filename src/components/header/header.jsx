import React from 'react';
import classnames from 'classnames/bind';

import Link from 'components/link';
// import AccountSection from './components/accountSection';
import LanguageSelector from './components/languageSelector';
import Menu from 'components/menu';
import { ROUTE_BASE } from 'routes';
import Logo from 'assets/logo.svg';

import styles from './header.module.scss';
const cx = classnames.bind(styles);

const Header = () => {
  return (
    <div className={cx('headerWrapper')}>
      <Menu />
      <Link to={ROUTE_BASE} className={cx('title')}>
        <Logo className={cx('logo')} />
      </Link>
      <div className={cx('options')}>
        {/* <AccountSection /> */}
        <LanguageSelector />
      </div>
    </div>
  );
};

export default Header;
