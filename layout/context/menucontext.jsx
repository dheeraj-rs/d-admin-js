"use client";
import React, { createContext, useContext, useState } from "react";

export const MenuContext = createContext({});
export const MenuProvider = ({ children }) => {
  const [activeMenu, setActiveMenu] = useState("");

  const value = {
    activeMenu,
    setActiveMenu,
  };
  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>;
};

export const useMenu = () => useContext(MenuContext);

/* Usage Example:
const NavMenu = () => {
  const { activeMenu, toggleMenu } = useMenu();
  
  return (
    <nav>
      <button onClick={() => toggleMenu('menu1')}>
        Menu 1
      </button>
      {activeMenu === 'menu1' && <div>Menu 1 Content</div>}
    </nav>
  );
}; 
*/
