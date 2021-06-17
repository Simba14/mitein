import React from 'react';
import { bool, node } from 'prop-types';
import { convert } from 'lodash/fp';
import { MenuContextConsumer, MenuContextProvider } from 'context/menu';
import Header from 'components/header';

import styles from './layout.module.scss';

// Remove cap on iteratee arguments
convert({ cap: false });

const Layout = ({ children, withContentPadding }) => (
  <MenuContextProvider>
    <div className={styles.wrapper}>
      <Header />
      <MenuContextConsumer>
        {({ isMenuOpen }) => (
          <div
            className={`${styles.content} ${
              withContentPadding ? styles.withPadding : ''
            } ${isMenuOpen ? styles.menuOpen : ''}`}
          >
            {children}
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
