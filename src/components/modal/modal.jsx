import React, { useEffect, useMemo, useRef } from 'react';
import classnames from 'classnames/bind';
import { createPortal } from 'react-dom';
import { bool, func, node, oneOfType, string } from 'prop-types';

import styles from './modal.module.scss';
const cx = classnames.bind(styles);

const NEXT_ROOT_ID = '#__next';

const Modal = ({ children, open, onClose, locked, parent, className }) => {
  const [active, setActive] = React.useState(false);

  const backdrop = useRef(null);
  const el = useMemo(() => document.createElement('div'), []);

  useEffect(() => {
    const target = parent && parent.appendChild ? parent : document.body;

    target.appendChild(el);

    return () => {
      target.removeChild(el);
    };
  }, [el, parent, className]);

  React.useEffect(() => {
    const { current } = backdrop;

    const transitionEnd = () => setActive(open);

    const keyHandler = (e) =>
      !locked && [27].indexOf(e.which) >= 0 && onClose();

    const clickHandler = (e) => !locked && e.target === current && onClose();

    if (current) {
      current.addEventListener('transitionend', transitionEnd);
      current.addEventListener('click', clickHandler);
      window.addEventListener('keyup', keyHandler);
    }

    if (open) {
      window.setTimeout(() => {
        document.activeElement.blur();
        setActive(open);
        document.querySelector(NEXT_ROOT_ID).setAttribute('inert', 'true');
      }, 10);
    }

    return () => {
      if (current) {
        current.removeEventListener('transitionend', transitionEnd);
        current.removeEventListener('click', clickHandler);
      }

      document.querySelector(NEXT_ROOT_ID).removeAttribute('inert');
      window.removeEventListener('keyup', keyHandler);
    };
  }, [open, locked, onClose]);

  const Backdrop = (
    <div
      ref={backdrop}
      className={cx('backdrop', className, { active: active && open })}
    >
      {children}
    </div>
  );

  if (open || active) return createPortal(Backdrop, el);
};

Modal.propTypes = {
  children: node.isRequired,
  className: string,
  locked: bool,
  open: oneOfType([bool, string]).isRequired,
  onClose: func.isRequired,
  parent: node,
};

Modal.defaultProps = {
  locked: false,
};

export default Modal;
