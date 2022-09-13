import React, { useCallback } from 'react';
import { useTranslation } from 'next-i18next';
import classnames from 'classnames/bind';
import { useMutation } from '@apollo/client';
import { useRouter } from 'next/router';
import { get } from 'lodash/fp';

import { MenuContextConsumer } from 'context/menu/';
import Anchor from 'components/atoms/anchor';
import Svg, { CLOSE, MENU } from 'components/atoms/svg';
import { ROUTE_ABOUT, ROUTE_HOW, ROUTE_SIGN_UP, ROUTE_VOLUNTEER } from 'routes';
import { sessionProps, withSessionContext } from 'context/session';
import SIGN_OUT from '@graphql/mutations/signOut.graphql';
import { ROUTE_LOGIN } from 'routes';

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
    title: 'volunteer',
    to: ROUTE_VOLUNTEER,
  },
];

const SIGN_UP_PROPS = {
  title: 'signUp',
  to: ROUTE_SIGN_UP,
};

export const Menu = ({ session }) => {
  const { t } = useTranslation('menu');
  const router = useRouter();
  const userId = get('userId', session);

  const signOutSuccessful = useCallback(() => {
    router.push(ROUTE_LOGIN);
    session.userLoggedOut();
  }, [router, session?.userLoggedOut]);

  const [signOut, { loading: signOutLoading }] = useMutation(SIGN_OUT, {
    onCompleted: signOutSuccessful,
  });

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
              {userId ? (
                <button
                  className={cx('navItem', 'button')}
                  onClick={signOut}
                  disabled={signOutLoading}
                >
                  {t('signOut')}
                </button>
              ) : (
                <Anchor
                  className={cx('navItem')}
                  activeClassName={cx('active')}
                  {...SIGN_UP_PROPS}
                >
                  {t(`items.${SIGN_UP_PROPS.title}.text`)}
                </Anchor>
              )}
            </nav>
          </div>
        );
      }}
    </MenuContextConsumer>
  );
};

Menu.propTypes = {
  session: sessionProps,
};

export default withSessionContext(Menu);
