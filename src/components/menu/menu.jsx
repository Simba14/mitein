import React from 'react';
import { useTranslation } from 'next-i18next';

import { MenuContextConsumer } from 'context/menu/';
import styles from './menu.module.scss';
import Link from 'components/link';

import { ROUTE_ABOUT, ROUTE_HOW, ROUTE_PROFILE, ROUTE_VOLUNTEER } from 'routes';

const MENU_ITEMS = [
  {
    'aria-label': 'About section on home page',
    title: 'about',
    hashId: 'about',
    to: ROUTE_ABOUT,
  },
  {
    'aria-label': 'How section on home page',
    title: 'how',
    hashId: 'how',
    to: ROUTE_HOW,
  },
  {
    'aria-label': 'Volunteer page',
    title: 'volunteer',
    to: ROUTE_VOLUNTEER,
  },
  // {
  //   'aria-label': 'Profile page',
  //   title: 'profile',
  //   to: ROUTE_PROFILE,
  // },
];

const Menu = () => {
  const { t } = useTranslation('menu');

  return (
    <MenuContextConsumer>
      {({ isMenuOpen, setIsMenuOpen }) => {
        const handleOnClick = () => setIsMenuOpen(!isMenuOpen);

        return (
          <>
            <button
              className={`${styles.buttonToggle} ${
                isMenuOpen ? styles.isOpen : ''
              }`}
              onClick={handleOnClick}
            />
            <nav className={`${styles.nav} ${isMenuOpen ? styles.isOpen : ''}`}>
              {MENU_ITEMS.map((item) => (
                <Link
                  key={item.title}
                  className={styles.navItem}
                  activeClassName={styles.active}
                  {...item}
                >
                  {t(item.title)}
                </Link>
              ))}
            </nav>
          </>
        );
      }}
    </MenuContextConsumer>
  );
};

export default Menu;
