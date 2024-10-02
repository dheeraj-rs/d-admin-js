// import Link from "next/link";
import React, { forwardRef, useContext, useState } from "react";
import { menuitem } from "@/public/layout/data";
import { LayoutContext } from "./context/layoutcontext";

const NavbarItem = ({ item }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleMouseEnter = () => setIsOpen(true);
  const handleMouseLeave = () => setIsOpen(false);

  if (item?.items) {
    return (
      <li
        className="navbar-item"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <span className="navbar-link">
          {item.icon && <i className={item.icon}></i>}
          {item.label}
          <i className="pi pi-angle-down"></i>
        </span>
        {isOpen && (
          <ul className="navbar-submenu">
            {item.items.map((subItem, index) => (
              <NavbarItem key={index} item={subItem} />
            ))}
          </ul>
        )}
      </li>
    );
  }

  return (
    <li className="navbar-item">
      <a href={item.to} className="navbar-link" target={item.target}>
        {item.icon && <i className={item.icon}></i>}
        {item.label}
      </a>
    </li>
  );
};

const AppTopbar = forwardRef((props, ref) => {
  const { layoutConfig, setLayoutConfig, layoutState, setLayoutState } =
    useContext(LayoutContext);

  const ToggleConfigBtn = () => {
    setLayoutState((prevLayoutState) => ({
      ...prevLayoutState,
      configSidebarVisible: !prevLayoutState.configSidebarVisible,
    }));
  };

  const ToggleSidebarBtn = () => {
    setLayoutState((prevLayoutState) => ({
      ...prevLayoutState,
      profileSidebarVisible: !prevLayoutState.profileSidebarVisible,
    }));
  };

  return (
    <div className="topbar-main">
      <div className="topbar-header">
        <nav className="breadcrumb">
          <span className="breadcrumb-link">Pages</span> / Main Page
        </nav>
        <h1 className="title">Main Page</h1>
      </div>

      <ul className="navbar-menu">
        {menuitem.map((item, index) => (
          <NavbarItem key={index} item={item} />
        ))}
      </ul>

      <button
        type="button"
        className="p-link layout-topbar-menu-button layout-topbar-button"
      >
        <i className="pi pi-ellipsis-v" />
      </button>
      <div className="layout-topbar-menu">
        <button type="button" className="p-link layout-topbar-button">
          <i className="pi pi-calendar"></i>
          <span>Calendar</span>
        </button>
        <button type="button" className="p-link layout-topbar-button">
          <i className="pi pi-user"></i>
          <span>Profile</span>
        </button>
        {/* <Link href="/"> */}
        <button
          type="button"
          className="p-link layout-topbar-button"
          onClick={ToggleConfigBtn}
        >
          <i className="pi pi-cog"></i>
          <span>Settings</span>
        </button>
        {/* </Link> */}
      </div>
      <button
        type="button"
        className="p-link layout-menu-button layout-topbar-button"
        onClick={(e) => {
          e.stopPropagation();
          ToggleSidebarBtn();
        }}
      >
        <i className="pi pi-bars" />
      </button>
    </div>
  );
});

AppTopbar.displayName = "AppTopbar";
export default AppTopbar;
