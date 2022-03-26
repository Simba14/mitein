import React from 'react';
import classnames from 'classnames/bind';
import { node, string, oneOf, oneOfType } from 'prop-types';
import styles from './text.module.scss';

const cx = classnames.bind(styles);

export const HEADING_1 = 'heading1';
export const HEADING_2 = 'heading2';
export const HEADING_3 = 'heading3';
export const HEADING_4 = 'heading4';
export const HEADING_5 = 'heading5';
export const HEADING_6 = 'heading6';
export const BODY_1 = 'body1';
export const BODY_2 = 'body2';
export const BODY_3 = 'body3';
export const BODY_4 = 'body4';
export const BODY_5 = 'body5';
export const BODY_6 = 'body6';

const TYPES = [
  HEADING_1,
  HEADING_2,
  HEADING_3,
  HEADING_4,
  HEADING_5,
  HEADING_6,
  BODY_1,
  BODY_2,
  BODY_3,
  BODY_4,
  BODY_5,
  BODY_6,
];

const Text = ({ children, className, tag, type, ...props }) => {
  return React.createElement(
    tag,
    { className: cx(className, { [type]: true }), ...props },
    children,
  );
};

Text.propTypes = {
  children: oneOfType([node, string]).isRequired,
  className: string,
  tag: string,
  type: oneOf(TYPES),
};

Text.defaultProps = {
  className: null,
  tag: 'p',
  type: BODY_5,
};

export default Text;
