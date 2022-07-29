import React, { createContext, useState } from 'react';
import { node } from 'prop-types';

const MenuContext = createContext();

export const MenuContextProvider = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
