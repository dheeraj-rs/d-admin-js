import React from "react";
import AppTopbar from "./AppTopbar";
import AppSidebar from "./AppSidebar";
import AppFooter from "./AppFooter";

function Layout({ children }) {
  return (
    <div>
      <div className="layout-topbar">
        <AppTopbar />
      </div>
      <div className="layout-sidebar">
        <AppSidebar />
      </div>
      <div className="layout-main-container">
        <div className="layout-main">{children}</div>
        <AppFooter />
      </div>
      <div className="layout-mask"></div>
    </div>
  );
}

export default Layout;
