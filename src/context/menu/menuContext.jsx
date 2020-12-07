import React, { createContext, useEffect, useState } from 'react';
import { node } from 'prop-types';
import useWindowDimensions from 'hooks/useWindowDimensions';
import { getIsMobile } from 'helpers';

const MenuContext = createContext();

export const MenuContextProvider = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { width } = useWindowDimensions();

  useEffect(() => {
    // if (getIsMobile(width) && isMenuOpen) setIsMenuOpen(false);
  }, [width]);

  return (
    <MenuContext.Provider value={{ isMenuOpen, setIsMenuOpen }}>
      {children}
    </MenuContext.Provider>
  );
};

MenuContextProvider.propTypes = {
  children: node.isRequired,
};

export const MenuContextConsumer = MenuContext.Consumer;
