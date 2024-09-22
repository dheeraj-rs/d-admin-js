import React from "react";
import { MenuProvider } from "./context/menucontext";

function AppSidebar() {
  return (
    <MenuProvider>
      {/* <div className="layout-sidebar"> */}
      <div className="layout-menu">AppSidebar</div>
      {/* </div> */}
    </MenuProvider>
  );
}

export default AppSidebar;
