import React from 'react';
import { useTranslation } from 'react-i18next';
import { MenuContextConsumer } from 'context/menu/';
import styles from './menu.module.scss';
import Link from 'components/link';

import { ROUTE_PROFILE, ROUTE_VOLUNTEER } from 'routes';

const Menu = () => {
  const { t } = useTranslation('menu');

  return (
    <MenuContextConsumer>
      {({ isMenuOpen, setIsMenuOpen }) => (
        <>
          <button
            className={`${styles.buttonToggle} ${
              isMenuOpen ? styles.isOpen : ''
            }`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          />
          <nav className={`${styles.nav} ${isMenuOpen ? styles.isOpen : ''}`}>
            <Link className={styles.navItem} to={''}>
              {t('about')}
            </Link>
            <Link className={styles.navItem} to={''}>
              {t('events')}
            </Link>
            <Link className={styles.navItem} to={ROUTE_PROFILE}>
              {t('profile')}
            </Link>
            <Link className={styles.navItem} to={ROUTE_VOLUNTEER}>
              {t('volunteer')}
            </Link>
          </nav>
        </>
      )}
    </MenuContextConsumer>
  );
};

export default Menu;
