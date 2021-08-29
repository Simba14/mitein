import React from 'react';
import classnames from 'classnames/bind';
import Link from 'components/link';
import { bool, oneOfType, node, string } from 'prop-types';

import styles from './anchor.module.scss';
const cx = classnames.bind(styles);

const Anchor = ({ children, className, href, underlined, ...rest }) =>
  href ? (
    <a {...rest} href={href} className={cx('link', { underlined }, className)}>
      {children}
    </a>
  ) : (
    <Link {...rest} className={cx('link', { underlined }, className)}>
      {children}
    </Link>
  );

Anchor.propTypes = {
  children: oneOfType([node, string]).isRequired,
  className: string,
  href: string,
  underlined: bool,
};

export default Anchor;
