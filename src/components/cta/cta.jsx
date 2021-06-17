import React from 'react';
import { bool, string, func } from 'prop-types';
import classnames from 'classnames/bind';

import Link from 'components/link';
import styles from './cta.module.scss';
const cx = classnames.bind(styles);

const Cta = ({ disabled, fullWidth, text, onClick, className, to, type }) => {
  if (to)
    return (
      <Link
        className={cx('cta', className, { fullWidth })}
        to={to}
        onClick={onClick}
      >
        {text}
      </Link>
    );

  return (
    <button
      className={cx('cta', className, { fullWidth })}
      type={type}
      disabled={disabled}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

Cta.propTypes = {
  className: string,
  disabled: bool,
  fullWidth: bool,
  onClick: func,
  text: string.isRequired,
  to: string,
  type: string,
};

Cta.defaultProps = {
  className: null,
  disabled: false,
  fullWidth: false,
  onClick: null,
  to: null,
  type: 'submit',
};

export default Cta;
