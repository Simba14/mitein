import React from 'react';
import { bool, node } from 'prop-types';
import { convert } from 'lodash/fp';
import { MenuContextConsumer, MenuContextProvider } from 'context/menu';
import classnames from 'classnames/bind';

import Header from 'components/header';
import Footer from 'components/footer';

import styles from './layout.module.scss';
const cx = classnames.bind(styles);

// Remove cap on iteratee arguments
convert({ cap: false });

const Layout = ({ children, withContentPadding }) => (
  <MenuContextProvider>
    <div className={cx('wrapper')}>
      <Header />
      <MenuContextConsumer>
        {({ isMenuOpen }) => (
          <div
            className={cx('container', {
              menuOpen: isMenuOpen,
            })}
          >
            <div
              className={cx('content', {
                withPadding: withContentPadding,
              })}
            >
              {children}
            </div>
            <Footer />
          </div>
        )}
      </MenuContextConsumer>
    </div>
  </MenuContextProvider>
);

Layout.propTypes = {
  children: node.isRequired,
  withContentPadding: bool,
};

Layout.defaultProps = {
  withContentPadding: true,
};

export default Layout;
