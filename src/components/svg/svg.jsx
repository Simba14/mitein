import React from 'react';

import Logo from 'assets/conversation.svg';
import Facebook from 'assets/facebook.svg';
import Instagram from 'assets/instagram.svg';
import Twitter from 'assets/twitter.svg';

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

const Svg = ({ name, ...rest }) => getPath(name, rest);
// <svg
//   className={className}
//   height={height}
//   viewBox={viewBox}
//   width={width}
//   xmlns="http://www.w3.org/2000/svg"
//   xmlnsXlink="http://www.w3.org/1999/xlink"
// >
//   {getPath(name)}
// </svg>

Svg.defaultProps = {
  height: '100%',
  name: LOGO,
  width: '100%',
  className: '',
};

export default Svg;
