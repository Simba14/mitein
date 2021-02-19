import React from 'react';
import { Link as GatsbyLink } from 'gatsby';
import { any, string } from 'prop-types';
import { usePageContext } from 'context/page';

// import styles from './anchor.module.scss';

const Link = ({ children, to, ...rest }) => {
  const { lang } = usePageContext();

  return (
    <GatsbyLink {...rest} to={`/${lang}${to}`}>
      {children}
    </GatsbyLink>
  );
};

Link.propTypes = {
  children: any,
  className: string,
  to: string.isRequired,
};

export default Link;
