import React from 'react';
import classnames from 'classnames/bind';
import { string } from 'prop-types';

import Logo from 'assets/conversation.svg';
import Facebook from 'assets/facebook.svg';
import Instagram from 'assets/instagram.svg';
import Twitter from 'assets/twitter.svg';

import styles from './svg.module.scss';
const cx = classnames.bind(styles);

export const LOGO = 'logo';
export const FB = 'facebook';
export const INSTA = 'instagram';
export const TWITTER = 'twitter';

const getPath = (name, props) => {
  switch (name) {
    case LOGO:
      return <Logo {...props} />;
    case FB:
      return <Facebook {...props} />;
    case INSTA:
      return <Instagram {...props} />;
    case TWITTER:
      return <Twitter {...props} />;
    default:
      return null;
  }
};

const Svg = ({ name, ...rest }) => (
  <>
    {getPath(name, rest)}
    <span className={cx('label')}>{name}</span>
  </>
);

Svg.defaultProps = {
  height: '100%',
  name: LOGO,
  width: '100%',
  className: '',
};

Svg.propTypes = {
  name: string,
};

export default Svg;
