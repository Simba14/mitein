import React from 'react';
import NextLink from 'next/link';
import { oneOfType, func, node, string } from 'prop-types';
import { useRouter } from 'next/router';

const handleScroll = ({ event, elementId, pathname }) => {
  if (pathname === '/') {
    event.preventDefault();
    const element = document.getElementById(elementId);
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    // update hash after scroll

    setTimeout(() => {
      window.location.hash = elementId;
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
  const { asPath, pathname, locale: existingLocale } = useRouter();
  const handleOnClick = hashId
    ? (event) => handleScroll({ event, elementId: hashId, pathname })
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
