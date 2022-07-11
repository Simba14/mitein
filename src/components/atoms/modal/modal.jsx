import React, { useEffect, useMemo, useRef, useState } from 'react';
import classnames from 'classnames/bind';
import { createPortal } from 'react-dom';
import FocusTrap from 'focus-trap-react';
import {
  bool,
  element,
  func,
  node,
  object,
  oneOfType,
  string,
} from 'prop-types';

import styles from './modal.module.scss';
import Svg, { CLOSE } from 'components/atoms/svg';
const cx = classnames.bind(styles);

const NEXT_ROOT_ID = '#__next';
export const BACKDROP_LABEL = 'dialog backdrop';

const Modal = ({ children, open, onClose, locked, parent, className }) => {
  const [active, setActive] = useState(false);

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

    const keyHandler = e => !locked && [27].indexOf(e.which) >= 0 && onClose();

    const clickHandler = e => !locked && e.target === current && onClose();

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

      document.querySelector(NEXT_ROOT_ID)?.removeAttribute('inert');
      window.removeEventListener('keyup', keyHandler);
    };
  }, [open, locked, onClose]);

  const Backdrop = (
    <FocusTrap>
      <div
        aria-modal={true}
        aria-label={BACKDROP_LABEL}
        ref={backdrop}
        className={cx('backdrop', className, { active: active && open })}
      >
        <button className={cx('close')} onClick={onClose}>
          <Svg aria-hidden={true} name={CLOSE} />
        </button>
        {children}
      </div>
    </FocusTrap>
  );

  if (open || active) return createPortal(Backdrop, el);
  return null;
};

Modal.propTypes = {
  children: node.isRequired,
  className: string,
  locked: bool,
  open: oneOfType([bool, string]).isRequired,
  onClose: func.isRequired,
  parent: oneOfType([element, object]),
};

Modal.defaultProps = {
  locked: false,
};

export default Modal;
