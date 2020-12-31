import React from 'react';
import { bool, node } from 'prop-types';
import { MenuContextProvider } from 'context/menu';
import Header from 'components/header';

import styles from './layout.module.scss';

const Layout = ({ children, withContentPadding }) => (
  <MenuContextProvider>
    <div className={styles.wrapper}>
      <Header />
      <div
        className={`${styles.content} ${
          withContentPadding ? styles.withPadding : ''
        }`}
      >
        {children}
      </div>
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
