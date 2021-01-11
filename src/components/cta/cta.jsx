import React from 'react';
import { bool, string, func } from 'prop-types';
import styles from './cta.module.scss';

const Cta = ({ disabled, text, onClick, className, type }) => {
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
  type: string,
};

Cta.defaultProps = {
  className: null,
  onClick: null,
  disabled: false,
  type: 'submit',
};

export default Cta;
