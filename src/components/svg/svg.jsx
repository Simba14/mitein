import React from 'react';
import Logo from 'assets/conversation.svg';

export const LOGO = 'logo';

const getPath = (name, props) => {
  switch (name) {
    case LOGO:
      return <Logo {...props} />;
    default:
      return <path />;
  }
};

const Svg = ({ name }) => getPath(name);
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
  viewBox: '0 0 32 32',
};

export default Svg;
