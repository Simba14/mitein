import React, { useState } from 'react';
import { node, string, bool, func, oneOfType, object } from 'prop-types';
import classnames from 'classnames/bind';

import AccordionHeader from './components/accordionHeader';
import AccordionContent from './components/accordionContent';
import styles from './accordion.module.scss';

const cx = classnames.bind(styles);

const Accordion = ({
  ariaId,
  className,
  content,
  contentClassName,
  headerClassName,
  headerText,
  onClick,
  open,
}) => {
  const [isOpen, setIsOpen] = useState(open);

  const handleOnClick = () => {
    if (onClick) onClick(isOpen);
    setIsOpen(!isOpen);
  };

  return (
    <div className={cx('container', className)}>
      <AccordionHeader
        ariaControls={`acc-controls-${ariaId}`}
        ariaId={`acc-labelledby-${ariaId}`}
        className={headerClassName}
        isOpen={isOpen}
        onClick={handleOnClick}
        text={headerText}
      />
      <AccordionContent
        className={contentClassName}
        isOpen={isOpen}
        ariaLabelledBy={`acc-labelledby-${ariaId}`}
        ariaId={`acc-controls-${ariaId}`}
      >
        {content}
      </AccordionContent>
    </div>
  );
};

Accordion.propTypes = {
  ariaId: string.isRequired,
  className: oneOfType([string, object]),
  content: node,
  contentClassName: oneOfType([string, object]),
  headerClassName: oneOfType([string, object]),
  headerText: string.isRequired,
  onClick: func,
  open: bool,
};

Accordion.defaultProps = {
  content: null,
  className: null,
  headerClassName: null,
  contentClassName: null,
  onClick: null,
  open: false,
};

export default Accordion;
