/* eslint-disable react/no-children-prop */
import Link from "next/link";
import React, {
  forwardRef,
  useContext,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { LayoutContext } from "./context/layoutcontext";
import { classNames, Dropdown } from "@/utils";
import { menuitem } from "@/public/layout/data";
import AppConfig from "./AppConfig";
import AppConfigbox from "./AppConfigbox";

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
  const {
    layoutConfig,
    layoutState,
    onMenuToggle,
    setLayoutState,
    showProfileSidebar,
  } = useContext(LayoutContext);
  const [toggle, setToggle] = useState(false);

  const menubuttonRef = useRef(null);
  const topbarmenuRef = useRef(null);
  const topbarmenubuttonRef = useRef(null);

  useImperativeHandle(ref, () => ({
    menubutton: menubuttonRef.current,
    topbarmenu: topbarmenuRef.current,
    topbarmenubutton: topbarmenubuttonRef.current,
  }));

  const ToggleConfigBtn = () => {
    setLayoutState((prevLayoutState) => ({
      ...prevLayoutState,
      configSidebarVisible: !prevLayoutState.configSidebarVisible,
    }));
  };

  return (
    <div className="topbar-main">
      {/* <Link href="/" className="layout-topbar-logo">
        <img
          src={`/layout/images/logo-${
            layoutConfig.colorScheme !== "light" ? "white" : "dark"
          }.svg`}
          width="47.22px"
          height="35px"
          alt="logo"
        />
        <span>DHEERAJ</span>
      </Link> */}

      <div className="topbar-header">
        <nav className="breadcrumb">
          <span className="breadcrumb-link">Pages</span> / Main Page
        </nav>
        <h1 className="title">Main Page</h1>
      </div>

      <button
        ref={menubuttonRef}
        type="button"
        className="p-link layout-menu-button layout-topbar-button"
        onClick={onMenuToggle}
      >
        <i className="pi pi-bars" />
      </button>

      <ul className="navbar-menu">
        {menuitem.map((item, index) => (
          <NavbarItem key={index} item={item} />
        ))}
      </ul>

      {/* <button
        ref={topbarmenubuttonRef}
        type="button"
        className="p-link layout-topbar-menu-button layout-topbar-button"
        onClick={showProfileSidebar}
      >
        <i className="pi pi-ellipsis-v" />
      </button> */}

      <div
        ref={topbarmenuRef}
        className={classNames("layout-topbar-menu", {
          "layout-topbar-menu-mobile-active": layoutState.profileSidebarVisible,
        })}
      >
        <button
          type="button"
          className="p-link layout-topbar-button"
          onClick={ToggleConfigBtn}
        >
          <i className="pi pi-user"></i>
          <span>Profile</span>
        </button>

        {/* <button type="button" className="p-link layout-topbar-button">
          <i className="pi pi-cog"></i>
          <span>Settings</span>
        </button> */}

        {/* <Dropdown
          button={<i className="pi pi-cog"></i>}
          className="p-link layout-topbar-button "
          children={<AppConfigbox />}
        /> */}
      </div>

      <Dropdown
        button={<i className="pi pi-ellipsis-v" />}
        className="p-link layout-topbar-menu-button"
        children={<AppConfigbox />}
      />
    </div>
  );
});

AppTopbar.displayName = "AppTopbar";
export default AppTopbar;
