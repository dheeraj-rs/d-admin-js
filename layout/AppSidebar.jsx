import React from "react";
import { MenuProvider } from "./context/menucontext";

function AppSidebar() {
  return (
    <MenuProvider>
      <div className="layout-menu">AppSidebar</div>
    </MenuProvider>
  );
}

export default AppSidebar;
