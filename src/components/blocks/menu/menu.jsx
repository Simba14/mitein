import React from 'react';
import { useTranslation } from 'next-i18next';
import classnames from 'classnames/bind';

import { MenuContextConsumer } from 'context/menu/';
import Anchor from 'components/atoms/anchor';
import Svg, { CLOSE, MENU } from 'components/atoms/svg';
import {
  ROUTE_ABOUT,
  ROUTE_HOW,
  ROUTE_RESOURCES,
  ROUTE_VOLUNTEER,
} from 'routes';

import styles from './menu.module.scss';
const cx = classnames.bind(styles);

const MENU_ITEMS = [
  {
    title: 'about',
    hashId: 'about',
    to: ROUTE_ABOUT,
  },
  {
    title: 'how',
    hashId: 'how',
    to: ROUTE_HOW,
  },
  {
    title: 'resources',
    to: ROUTE_RESOURCES,
  },
  {
    title: 'volunteer',
    to: ROUTE_VOLUNTEER,
  },
];

export const Menu = () => {
  const { t } = useTranslation('menu');

  return (
    <MenuContextConsumer>
      {({ isMenuOpen, setIsMenuOpen }) => {
        const handleToggleClick = () => setIsMenuOpen(!isMenuOpen);

        return (
          <div className={cx('menu')}>
            <button
              className={cx('buttonToggle', {
                isOpen: isMenuOpen,
              })}
              onClick={handleToggleClick}
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
                  aria-label={t(`items.${item.title}.label`)}
                  key={item.title}
                  className={cx('navItem')}
                  activeClassName={cx('active')}
                  {...item}
                >
                  {t(`items.${item.title}.text`)}
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
