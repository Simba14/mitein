import React from 'react';
import classnames from 'classnames/bind';
import { node, string, oneOf, oneOfType } from 'prop-types';

import styles from './textBanner.module.scss';
import { EGG_SHELL } from '@constants/colors';
import Text, { HEADING_1, TEXT_TYPES } from 'components/atoms/text';
const cx = classnames.bind(styles);

const TextBanner = ({
  backgroundColor,
  children,
  className,
  tag,
  textType,
}) => {
  return (
    <Text
      className={cx('banner', className)}
      style={{ backgroundColor }}
      tag={tag}
      type={textType}
      bold
    >
      {children}
    </Text>
  );
};

TextBanner.propTypes = {
  children: oneOfType([node, string]).isRequired,
  className: string,
  backgroundColor: string,
  tag: string,
  textType: oneOf(TEXT_TYPES),
};

TextBanner.defaultProps = {
  className: null,
  backgroundColor: EGG_SHELL,
  tag: 'h1',
  textType: HEADING_1,
};

export default TextBanner;
