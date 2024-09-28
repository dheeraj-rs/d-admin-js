import React from "react";
import { MenuProvider } from "./context/menucontext";
import AppMenuitem from "./AppMenuitem";
import { menuitem } from "@/public/layout/data";

function AppSidebar() {
  return (
    <MenuProvider>
      <ul className="sidebar-menu">
        {menuitem.map((item, i) => {
          return !item?.seperator ? (
            <AppMenuitem item={item} root={true} index={i} key={item.label} />
          ) : (
            <li key={`separator-${i}`} className="menu-separator"></li>
          );
        })}
        <div className="searchbar-container">
          <div className="icon">
            <i className="pi  pi-search search-icon"></i>
          </div>
          <input type="text" className="input" />
        </div>
      </ul>
    </MenuProvider>
  );
}

export default AppSidebar;
