import React from 'react';
import NextLink from 'next/link';
import { oneOfType, func, node, string } from 'prop-types';
import { useRouter } from 'next/router';
import { polyfill } from 'seamless-scroll-polyfill';
import { ROUTE_BASE } from 'routes';

const handleScroll = ({ event, elementId, pathname, push }) => {
  if (pathname === ROUTE_BASE) {
    event.preventDefault();
    polyfill();
    const element = document.getElementById(elementId);
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    // update hash after scroll
    setTimeout(() => {
      push(`/#${elementId}`, undefined, { shallow: true });
    }, 500);
  }
};

const Link = ({
  activeClassName,
  children,
  className,
  hashId,
  locale,
  onClick,
  to,
  ...rest
}) => {
  const { asPath, pathname, locale: existingLocale, push } = useRouter();
  const handleOnClick = hashId
    ? event => handleScroll({ event, elementId: hashId, pathname, push })
    : onClick;

  const classNames =
    activeClassName && to === asPath
      ? `${className} ${activeClassName}`
      : className;

  return (
    <NextLink href={to} locale={locale || existingLocale}>
      <a {...rest} className={classNames} onClick={handleOnClick}>
        {children}
      </a>
    </NextLink>
  );
};

Link.propTypes = {
  activeClassName: string,
  children: oneOfType([node, string]).isRequired,
  className: string,
  hashId: string,
  locale: string,
  onClick: func,
  to: string.isRequired,
};

Link.defaultProps = {
  locale: null,
};

export default Link;
