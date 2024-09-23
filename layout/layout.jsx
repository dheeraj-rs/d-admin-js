"use client";
import React from "react";
import AppTopbar from "./AppTopbar";
import AppSidebar from "./AppSidebar";
import AppFooter from "./AppFooter";

function Layout({ children }) {
  const containerClass =
    "layout-wrapper layout-mobile-active3  layout-overlay3 layout-overlay-active3 layout-static3 layout-topbar-static3";

  return (
    <div className={containerClass}>
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
