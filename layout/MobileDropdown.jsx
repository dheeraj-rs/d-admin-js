// MobileDropdown.js
import React, { useState, useRef, useContext } from "react";
import { CSSTransition } from "react-transition-group";
import { LayoutContext } from "./context/layoutcontext"; // Import LayoutContext
import AppConfig from "./AppConfig"; // Import AppConfig for rendering

// DropdownItem Component
const DropdownItem = ({ children, onClick }) => {
  return (
    <li className="m-dropdown-item" onClick={onClick}>
      {children}
    </li>
  );
};

// ToggleSwitch Component
const ToggleSwitch = ({ isEnabled, onToggle, label, className }) => {
  return (
    <div className={`m-toggle-m-switch ${className}`}>
      <span>{label}</span>
      <label className="m-switch">
        <input type="checkbox" checked={isEnabled} onChange={onToggle} />
        <span className="m-slider m-round"></span>
      </label>
    </div>
  );
};

const MobileDropdown = () => {
  const { layoutConfig, setLayoutConfig } = useContext(LayoutContext); // Use LayoutContext
  const [activeMenu, setActiveMenu] = useState("main");
  const [menuHeight, setMenuHeight] = useState(null);

  const dropdownRef = useRef(null);

  const calcHeight = (el) => {
    const height = el.offsetHeight;
    setMenuHeight(height);
  };

  // Sidebar and Navbar mode states
  const [sidebarMode, setSidebarMode] = useState(layoutConfig.menuMode);
  const [navbarMode, setNavbarMode] = useState(layoutConfig.navbarMode);

  const changeMenuMode = (value) => {
    setLayoutConfig((prevState) => ({
      ...prevState,
      menuMode: value,
    }));
    setSidebarMode(value); // Update sidebar mode state
  };

  const changeNavbarMode = (value) => {
    setLayoutConfig((prevState) => ({
      ...prevState,
      navbarMode: value,
    }));
    setNavbarMode(value); // Update navbar mode state
  };

  // Updated dropdownData to include AppConfig functionality
  const dropdownData = [
    {
      menu: "main",
      items: [
        { label: "Settings", onClick: () => setActiveMenu("settings") },
        { label: "Profile", onClick: () => setActiveMenu("profile") },
        { label: "Config", onClick: () => setActiveMenu("config") },
      ],
    },
    {
      menu: "settings",
      items: [
        { label: "Back to Main", onClick: () => setActiveMenu("main") },
        // Other settings items...
      ],
    },
    {
      menu: "profile",
      items: [
        { label: "Back to Main", onClick: () => setActiveMenu("main") },
        {
          label: "Profile Overview",
          onClick: () => setActiveMenu("profileOverview"),
        },
        { label: "Edit Profile" },
      ],
    },
    {
      menu: "config",
      items: [
        { label: "Back to Main", onClick: () => setActiveMenu("main") },
        { label: "Sidebar" },
        {
          component: (
            <ToggleSwitch
              isEnabled={sidebarMode === "auto"}
              className={layoutConfig?.menuMode === "auto" ? "active" : ""}
              onToggle={() => changeMenuMode("auto")}
              label="auto"
            />
          ),
        },
        {
          component: (
            <ToggleSwitch
              isEnabled={sidebarMode === "static"}
              className={layoutConfig?.menuMode === "static" ? "active" : ""}
              onToggle={() => changeMenuMode("static")}
              label="static"
            />
          ),
        },
        {
          component: (
            <ToggleSwitch
              isEnabled={sidebarMode === "overlay"}
              className={layoutConfig?.menuMode === "overlay" ? "active" : ""}
              onToggle={() => changeMenuMode("overlay")}
              label="overlay"
            />
          ),
        },
        { label: "Navbar" },
        {
          component: (
            <ToggleSwitch
              isEnabled={navbarMode === "static"}
              className={layoutConfig?.navbarMode === "static" ? "active" : ""}
              onToggle={() => changeNavbarMode("static")}
              label="static"
            />
          ),
        },
        {
          component: (
            <ToggleSwitch
              isEnabled={navbarMode === "overlay"}
              className={layoutConfig?.navbarMode === "overlay" ? "active" : ""}
              onToggle={() => changeNavbarMode("overlay")}
              label="overlay"
            />
          ),
        },
      ],
    },
    {
      menu: "profileOverview",
      items: [
        { label: "Back to Profile", onClick: () => setActiveMenu("profile") },
        // Features for profile overview...
      ],
    },
  ];

  const renderDropdownMenu = () => {
    const activeMenuData = dropdownData.find(
      (menu) => menu.menu === activeMenu
    );

    if (!activeMenuData) return null;

    return (
      <CSSTransition
        in={!!activeMenuData}
        timeout={300}
        classNames="menu"
        unmountOnExit
        onEnter={calcHeight}
      >
        <ul className="m-dropdown-menu">
          {activeMenuData.items.map((item, index) => (
            <DropdownItem key={index} onClick={item.onClick}>
              {item.component || item.label}
            </DropdownItem>
          ))}
        </ul>
      </CSSTransition>
    );
  };

  return (
    <div
      className="m-dropdown"
      style={{ height: menuHeight }}
      ref={dropdownRef}
    >
      {renderDropdownMenu()}
    </div>
  );
};

export default MobileDropdown;
