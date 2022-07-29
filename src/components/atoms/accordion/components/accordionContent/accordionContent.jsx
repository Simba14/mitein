import React from 'react';
import { node, bool, string } from 'prop-types';
import classnames from 'classnames/bind';
import styles from './accordionContent.module.scss';

const cx = classnames.bind(styles);

const AccordionContent = ({
  children,
  className,
  isOpen,
  ariaId,
  ariaLabelledBy,
}) => (
  <div
    className={cx('accordionContent', { isOpen }, className)}
    id={ariaId}
    aria-labelledby={ariaLabelledBy}
    role="region"
  >
    {children}
  </div>
);

AccordionContent.propTypes = {
  children: node,
  className: string,
  isOpen: bool.isRequired,
  ariaId: string.isRequired,
  ariaLabelledBy: string.isRequired,
};

AccordionContent.defaultProps = {
  children: null,
  className: null,
};

export default AccordionContent;
