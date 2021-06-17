import React from 'react';
import Link from 'components/link';
import { oneOfType, node, string } from 'prop-types';

import styles from './anchor.module.scss';

const Anchor = ({ children, className, ...rest }) => (
  <Link {...rest} className={`${styles.link} ${className}`}>
    {children}
  </Link>
);

Anchor.propTypes = {
  children: oneOfType([node, string]).isRequired,
  className: string,
};

export default Anchor;
