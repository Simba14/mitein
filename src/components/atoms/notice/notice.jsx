import React from 'react';
import classnames from 'classnames/bind';
import { node, string, oneOf, oneOfType } from 'prop-types';

import styles from './notice.module.scss';
const cx = classnames.bind(styles);

const DEFAULT = 'default';
export const ALERT = 'alert';
export const INFO = 'info';
export const SUCCESS = 'success';
export const TIP = 'tip';
export const WARNING = 'warning';

export const NOTICE_TYPES = [ALERT, DEFAULT, INFO, SUCCESS, TIP, WARNING];

const Notice = ({ children, className, type }) => {
  return <div className={cx('box', className, type)}>{children}</div>;
};

Notice.propTypes = {
  children: oneOfType([node, string]).isRequired,
  className: string,
  type: oneOf(NOTICE_TYPES),
};

Notice.defaultProps = {
  className: null,
  type: DEFAULT,
};

export default Notice;
