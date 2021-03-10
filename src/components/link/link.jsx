import React from 'react';
import { Link as GatsbyLink } from 'gatsby';
import { get } from 'lodash/fp';
import { any, func, string } from 'prop-types';
import { usePageContext } from 'context/page';

const handleScroll = ({ event, elementId, lang }) => {
  if (get('location.pathname', window) === `/${lang}/`) {
    event.preventDefault();
    const element = document.getElementById(elementId);
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    // update hash after scroll
    setTimeout(() => {
      window.location.hash = elementId;
    }, 500);
  }
};

const isActive = ({ activeClassName, className, href, location }) => {
  const active =
    activeClassName && href === `${location.pathname}${location.hash}`;

  return active ? { className: `${className} ${activeClassName}` } : {};
};

const Link = ({
  activeClassName,
  children,
  className,
  hashId,
  onClick,
  to,
  ...rest
}) => {
  const { lang } = usePageContext();
  const handleOnClick = hashId
    ? (event) => handleScroll({ event, elementId: hashId, lang })
    : onClick;

  const getIsActive = (props) =>
    isActive({ ...props, className, activeClassName });

  return (
    <GatsbyLink
      activeClassName={activeClassName}
      className={className}
      {...rest}
      getProps={getIsActive}
      to={`/${lang}${to}`}
      onClick={handleOnClick}
    >
      {children}
    </GatsbyLink>
  );
};

Link.propTypes = {
  activeClassName: string,
  children: any,
  className: string,
  hashId: string,
  onClick: func,
  to: string.isRequired,
};

export default Link;
