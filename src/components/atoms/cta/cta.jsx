import React from 'react';
import { bool, string, func } from 'prop-types';
import classnames from 'classnames/bind';

import Link from 'components/atoms/link';
import { LoadingRing } from 'components/atoms/loading';

import styles from './cta.module.scss';
import { oneOf } from 'prop-types';
const cx = classnames.bind(styles);

export const CTA_SIZES = {
  regular: 'regular',
  jumbo: 'jumbo',
};

const Cta = ({
  className,
  disabled,
  fullWidth,
  loading,
  onClick,
  outline,
  size,
  text,
  to,
  type,
}) => {
  if (to)
    return (
      <Link
        className={cx('cta', className, {
          fullWidth,
          outline,
          jumbo: size === CTA_SIZES.jumbo,
        })}
        to={to}
        onClick={onClick}
      >
        {text}
      </Link>
    );

  return (
    <button
      className={cx('cta', className, {
        fullWidth,
        outline,
        jumbo: size === CTA_SIZES.jumbo,
      })}
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading ? <LoadingRing /> : text}
    </button>
  );
};

Cta.propTypes = {
  className: string,
  disabled: bool,
  fullWidth: bool,
  loading: bool,
  onClick: func,
  outline: bool,
  size: oneOf(Object.keys(CTA_SIZES)),
  text: string.isRequired,
  to: string,
  type: string,
};

Cta.defaultProps = {
  className: null,
  disabled: false,
  fullWidth: false,
  loading: false,
  onClick: null,
  outline: false,
  size: CTA_SIZES.regular,
  to: null,
  type: 'button',
};

export default Cta;
