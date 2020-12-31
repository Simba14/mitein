import React from 'react';
import Svg, { LOGO } from 'components/svg/';
import { Link } from 'gatsby';
import { useTranslation } from 'react-i18next';

import AccountSection from './components/accountSection';
import LanguageSelector from './components/languageSelector';
import DropdownMenu from 'components/menu/dropdown.jsx';
import { ROUTE_BASE } from 'routes';
import { MenuContextConsumer } from 'context/menu';

import styles from './header.module.scss';

const Header = () => {
  const { t } = useTranslation('header');

  return (
    <MenuContextConsumer>
      {({ isMenuOpen }) => (
        <div
          className={`${styles.headerWrapper} ${
            isMenuOpen ? styles.menuIsOpen : ''
          }`}
        >
          <DropdownMenu />
          <div className={styles.header}>
            <Link to={ROUTE_BASE} className={styles.logoContainer}>
              <Svg className={styles.logo} name={LOGO} />
              <div className={styles.title}>{t('mitein')}</div>
            </Link>
            <div className={styles.options}>
              <AccountSection />
              <LanguageSelector />
            </div>
          </div>
        </div>
      )}
    </MenuContextConsumer>
  );
};

export default Header;
