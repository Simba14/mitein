import React from 'react';
import { useTranslation } from 'next-i18next';
import classnames from 'classnames/bind';

import { MenuContextConsumer } from 'context/menu/';
import Anchor from 'components/anchor';
import Svg, { CLOSE, MENU } from 'components/svg';
import { ROUTE_ABOUT, ROUTE_HOW, ROUTE_VOLUNTEER } from 'routes';

import styles from './menu.module.scss';
const cx = classnames.bind(styles);

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
          <div className={cx('menu')}>
            <button
              className={cx('buttonToggle', {
                isOpen: isMenuOpen,
              })}
              onClick={handleOnClick}
            >
              <Svg className={cx('icon')} name={isMenuOpen ? CLOSE : MENU} />
            </button>
            <nav
              className={cx('nav', {
                isOpen: isMenuOpen,
              })}
            >
              {MENU_ITEMS.map(item => (
                <Anchor
                  key={item.title}
                  className={cx('navItem')}
                  activeClassName={cx('active')}
                  {...item}
                >
                  {t(item.title)}
                </Anchor>
              ))}
            </nav>
          </div>
        );
      }}
    </MenuContextConsumer>
  );
};

export default Menu;
