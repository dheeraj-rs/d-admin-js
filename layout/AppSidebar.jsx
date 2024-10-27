"use client";

import React, { useContext } from "react";
import { MenuProvider } from "./context/menucontext";
import AppMenuitem from "./AppMenuitem";
import { menuitem } from "@/public/layout/data";
import { LayoutContext } from "./context/layoutcontext";

const AppSidebar = () => {
  const { layoutState } = useContext(LayoutContext);

  const effectiveMenuItems =
    layoutState?.searchSidebarItems.length > 0
      ? layoutState.searchSidebarItems
      : menuitem;

  const renderMenuItem = (item, index) => {
    if (item.seperator) {
      return <li key={`separator-${index}`} className="menu-separator" />;
    }

    return (
      <AppMenuitem
        key={item.label || index}
        item={item}
        root={true}
        index={index}
      />
    );
  };

  return (
    <MenuProvider>
      <div className="sidebar-menu-container">
        <ul className="sidebar-menu">
          {effectiveMenuItems?.map(renderMenuItem)}
          <div className="menuDummyItem" />
        </ul>
      </div>
    </MenuProvider>
  );
};

export default AppSidebar;
