import React, { useState, useMemo, useContext } from "react";
import { MenuProvider } from "./context/menucontext";
import AppMenuitem from "./AppMenuitem";
import { menuitem } from "@/public/layout/data";
import { LayoutContext } from "./context/layoutcontext";
import { LayoutSearchbar } from "./utils";

const AppSidebar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { layoutState, setLayoutState } = useContext(LayoutContext);

  const activeSearchbar = () => {
    setLayoutState((prevState) => ({
      ...prevState, // spread previous state to retain other properties
      hoverSearchbar: !prevState.hoverSearchbar, // toggle hoverSearchbar
    }));
  };

  const filterMenuItems = (items, term) => {
    return items
      .map((item) => {
        if (item.seperator) return item;

        const matchesSearch = item.label
          .toLowerCase()
          .includes(term.toLowerCase());
        const filteredItems = item.items
          ? filterMenuItems(item.items, term)
          : null;

        if (
          matchesSearch ||
          (filteredItems && filteredItems.some((i) => i !== null))
        ) {
          return {
            ...item,
            items: filteredItems,
          };
        }

        return null;
      })
      .filter((item) => item !== null);
  };

  const filteredMenuItems = useMemo(
    () => (searchTerm ? filterMenuItems(menuitem, searchTerm) : []),
    [searchTerm]
  );

  const hasSearchResults = filteredMenuItems.length > 0;

  return (
    <MenuProvider>
      <div className="sidebar-menu-container">
        <ul className="sidebar-menu">
          {(layoutState?.searchSidebarItems.length !== 0
            ? layoutState?.searchSidebarItems
            : menuitem
          )?.map((item, i) =>
            !item?.seperator ? (
              <AppMenuitem item={item} root={true} index={i} key={item.label} />
            ) : (
              <li key={`separator-${i}`} className="menu-separator"></li>
            )
          )}
          <div className="menuDummyItem" />
        </ul>
      </div>
    </MenuProvider>
  );
};

export default AppSidebar;
