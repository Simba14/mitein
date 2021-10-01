import React from 'react';
import { bool, node, string } from 'prop-types';
import { convert } from 'lodash/fp';
import { MenuContextConsumer, MenuContextProvider } from 'context/menu';
import classnames from 'classnames/bind';

import ConsentLayer from 'components/consentLayer/consentLayer';
import Header from 'components/header';
// import Footer from 'components/footer';

import styles from './layout.module.scss';
const cx = classnames.bind(styles);

// Remove cap on iteratee arguments
convert({ cap: false });

const Layout = ({ children, className, withContentPadding }) => {
  return (
    <MenuContextProvider>
      <div className={cx('wrapper')}>
        <Header />
        <MenuContextConsumer>
          {({ isMenuOpen }) => (
            <div
              className={cx('container', className, {
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
              {/* <Footer /> */}
            </div>
          )}
        </MenuContextConsumer>
      </div>
      <ConsentLayer />
    </MenuContextProvider>
  );
};

Layout.propTypes = {
  children: node.isRequired,
  className: string,
  withContentPadding: bool,
};

Layout.defaultProps = {
  className: null,
  withContentPadding: true,
};

export default Layout;
