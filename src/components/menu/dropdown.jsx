import React from 'react';
import { useTranslation } from 'react-i18next';
import { MenuContextConsumer } from 'context/menu/';
import styles from './dropdownMenu.module.scss';

const DropdownMenu = () => {
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

export default DropdownMenu;
