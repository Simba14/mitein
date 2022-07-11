import React from 'react';
import { bool, node, string } from 'prop-types';
import { convert } from 'lodash/fp';
import { MenuContextConsumer, MenuContextProvider } from 'context/menu';
import classnames from 'classnames/bind';
import 'react-toastify/dist/ReactToastify.css';

import ConsentLayer from 'components/blocks/consentLayer/consentLayer';
import Header from 'components/blocks/header';
import Footer from 'components/blocks/footer';

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
                  withFooter,
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
      <ConsentLayer />
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
