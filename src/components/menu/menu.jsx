import React from 'react';
import { MenuContextConsumer } from 'context/menu/';
import { useTranslation } from 'react-i18next';
import { string } from 'prop-types';

import styles from './menu.module.scss';

const Menu = ({ className }) => {
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
          >
            Menu
          </button>
          <nav className={`${styles.nav} ${isMenuOpen ? styles.isOpen : ''}`}>
            <a className={styles.navItem} href="">
              {t('about')}
            </a>
            <a className={styles.navItem} href="">
              {t('events')}
            </a>
            <a className={styles.navItem} href="">
              {t('profile')}
            </a>
            <a className={styles.navItem} href="">
              {t('resources')}
            </a>
          </nav>
        </>
      )}
    </MenuContextConsumer>
  );
};

// <div className={`${styles.container} ${className}`}>
//   <div className={styles.item}>{t('about')}</div>
//   <div className={styles.item}>{t('events')}</div>
//   <div className={styles.item}>{t('profile')}</div>
//   <div className={styles.item}>{t('resources')}</div>
// </div>

Menu.propTypes = {
  className: string,
};

Menu.defaultProps = {
  className: null,
};

export default Menu;
