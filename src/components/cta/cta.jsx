import React from 'react';
import { bool, string, func } from 'prop-types';

import Link from 'components/link';
import styles from './cta.module.scss';

const Cta = ({ disabled, text, onClick, className, to, type }) => {
  if (to)
    return (
      <Link className={`${styles.cta} ${className}`} to={to} onClick={onClick}>
        {text}
      </Link>
    );

  return (
    <button
      className={`${styles.cta} ${className}`}
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
  onClick: func,
  text: string.isRequired,
  to: string,
  type: string,
};

Cta.defaultProps = {
  className: null,
  onClick: null,
  disabled: false,
  to: null,
  type: 'submit',
};

export default Cta;
