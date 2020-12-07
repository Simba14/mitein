import React from 'react';
import { bool, node } from 'prop-types';
import { MenuContextProvider, MenuContextConsumer } from 'context/menu';
import Header from 'components/header';
// import Menu from 'components/menu';

import styles from './layout.module.scss';

const Layout = ({ children, withContentPadding }) => (
  <MenuContextProvider>
    <div className={styles.wrapper}>
      <Header />
      <MenuContextConsumer>
        {({ isMenuOpen }) => (
          <div
            className={`${styles.container} ${
              isMenuOpen ? styles.menuIsOpen : ''
            }`}
          >
            <div
              className={`${styles.content} ${
                withContentPadding ? styles.withPadding : ''
              }`}
            >
              {children}
            </div>
            {/*isMenuOpen && <Menu /> */}
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
