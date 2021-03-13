import React from 'react';
import Svg, { LOGO } from 'components/svg/';
import Link from 'components/link';
import { useTranslation } from 'react-i18next';

import AccountSection from './components/accountSection';
import LanguageSelector from './components/languageSelector';
import Menu from 'components/menu';
import { ROUTE_BASE } from 'routes';

import styles from './header.module.scss';

const Header = () => {
  const { t } = useTranslation('header');

  return (
    <div className={styles.headerWrapper}>
      <Menu />
      <div className={styles.header}>
        <Link to={ROUTE_BASE} className={styles.logoContainer}>
          <Svg className={styles.logo} name={LOGO} />
          <div className={styles.title}>{t('mitein')}</div>
        </Link>
        <div className={styles.options}>
          {/*<AccountSection />*/}
          <LanguageSelector />
        </div>
      </div>
    </div>
  );
};

export default Header;