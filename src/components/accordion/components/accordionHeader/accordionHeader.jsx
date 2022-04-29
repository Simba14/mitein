import React from 'react';
import { bool, func, oneOfType, string, object } from 'prop-types';
import classnames from 'classnames/bind';
import ArrowIcon from 'assets/arrowDown.svg';
import Text, { HEADING_4 } from 'components/text';

import styles from './accordionHeader.module.scss';

const cx = classnames.bind(styles);

const AccordionHeader = ({
  ariaControls,
  ariaId,
  className,
  isOpen,
  onClick,
  text,
}) => (
  <button
    className={cx('accordionHeader', { isOpen }, className)}
    onClick={onClick}
    aria-expanded={isOpen}
    id={ariaId}
    aria-controls={ariaControls}
  >
    <Text tag="h3" type={HEADING_4}>
      {text}
    </Text>
    <ArrowIcon className={cx('arrow')} />
  </button>
);

AccordionHeader.propTypes = {
  ariaControls: string.isRequired,
  ariaId: string.isRequired,
  className: oneOfType([string, object]),
  isOpen: bool.isRequired,
  onClick: func.isRequired,
  text: string.isRequired,
};

AccordionHeader.defaultProps = {
  className: null,
};

export default AccordionHeader;
