import React from 'react';
import { bool, string, func } from 'prop-types';
import classnames from 'classnames/bind';

import Link from 'components/atoms/link';
import styles from './cta.module.scss';
import { LoadingRing } from '../loading';
const cx = classnames.bind(styles);

const Cta = ({
  disabled,
  fullWidth,
  text,
  loading,
  onClick,
  outline,
  className,
  to,
  type,
}) => {
  if (to)
    return (
      <Link
        className={cx('cta', className, { fullWidth, outline })}
        to={to}
        onClick={onClick}
      >
        {text}
      </Link>
    );

  return (
    <button
      className={cx('cta', className, { fullWidth, outline })}
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
  to: null,
  type: 'button',
};

export default Cta;
