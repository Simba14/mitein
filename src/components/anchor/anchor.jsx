import React from 'react';
import { Link } from 'gatsby';
import { any } from 'prop-types';

import styles from './anchor.module.scss';

const Anchor = ({ children, ...rest }) => (
  <Link {...rest} className={styles.link}>
    {children}
  </Link>
);

Anchor.propTypes = {
  children: any.isRequired,
};

export default Anchor;
