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
      <div className="sidebar-menu-container"></div>
    </MenuProvider>
  );
};

export default AppSidebar;
