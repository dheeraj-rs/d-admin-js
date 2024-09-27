import React from "react";
import { MenuProvider } from "./context/menucontext";

function AppSidebar() {
  return (
    <MenuProvider>
      <div className="sidebar-menu">Sidebar</div>
    </MenuProvider>
  );
}

export default AppSidebar;
