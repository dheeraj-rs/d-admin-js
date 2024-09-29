import React, { useState, useMemo } from "react";
import { MenuProvider } from "./context/menucontext";
import AppMenuitem from "./AppMenuitem";
import { menuitem } from "@/public/layout/data";

const AppSidebar = () => {
  const [searchTerm, setSearchTerm] = useState("");

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
        <div className="searchbar-container">
          <div className="icon">
            {searchTerm && !hasSearchResults ? (
              <i className="pi pi-exclamation-triangle"></i>
            ) : (
              <i className="pi pi-search search-icon"></i>
            )}
          </div>
          <input
            type="text"
            className="input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search menu items..."
          />
        </div>

        <div className="menu-content">
          <ul className="sidebar-menu">
            {(searchTerm && hasSearchResults
              ? filteredMenuItems
              : menuitem
            ).map((item, i) =>
              !item?.seperator ? (
                <AppMenuitem
                  item={item}
                  root={true}
                  index={i}
                  key={item.label}
                />
              ) : (
                <li key={`separator-${i}`} className="menu-separator"></li>
              )
            )}
          </ul>
        </div>
      </div>
    </MenuProvider>
  );
};

export default AppSidebar;
