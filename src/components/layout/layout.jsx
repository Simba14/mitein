import React from 'react';
import { bool, node, string } from 'prop-types';
import { convert } from 'lodash/fp';
import { MenuContextConsumer, MenuContextProvider } from 'context/menu';
import classnames from 'classnames/bind';

// import ConsentLayer from 'components/consentLayer/consentLayer';
import Header from 'components/header';
import Footer from 'components/footer';

import styles from './layout.module.scss';
const cx = classnames.bind(styles);

// Remove cap on iteratee arguments
convert({ cap: false });

const Layout = ({ children, className, withContentPadding, withFooter }) => {
  return (
    <MenuContextProvider>
      <div className={cx('wrapper')}>
        <Header />
        <MenuContextConsumer>
          {({ isMenuOpen }) => (
            <>
              <div
                className={cx('container', className, {
                  menuOpen: isMenuOpen,
                  withPadding: withContentPadding,
                })}
              >
                {children}
                {withFooter && (
                  <Footer className={cx('footer', { withContentPadding })} />
                )}
              </div>
            </>
          )}
        </MenuContextConsumer>
      </div>
      {/* <ConsentLayer /> */}
    </MenuContextProvider>
  );
};

Layout.propTypes = {
  children: node.isRequired,
  className: string,
  withContentPadding: bool,
  withFooter: bool,
};

Layout.defaultProps = {
  className: null,
  withContentPadding: true,
  withFooter: true,
};

export default Layout;
