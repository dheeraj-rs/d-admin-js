import React, { useState, useRef, useContext, useEffect } from "react";
import { CSSTransition } from "react-transition-group";
import { LayoutContext } from "./context/layoutcontext";
import { LayoutSettings } from "./utils";

const MenuModeRadioGroup = ({ selectedMode, onChange }) => {
  const navbarOptions = [
    { value: "static", label: "Static" },
    { value: "overlay", label: "Overlay" },
  ];

  const sidebarOptions = [
    { value: "auto", label: "Auto" },
    { value: "static", label: "Static" },
    { value: "overlay", label: "Overlay" },
  ];

  const modes = [
    { value: "navbar", label: "Navbar" },
    { value: "sidebar", label: "Sidebar" },
  ];

  return (
    <div className="menu-mode-radio-group">
      <div className="menu-mode-radio-group__mode-selection">
        {modes.map((mode) => (
          <label
            key={mode.value}
            className="menu-mode-radio-group__radio-option"
          >
            <input
              type="radio"
              name="menuMode"
              value={mode.value}
              checked={selectedMode === mode.value}
              onChange={(e) => onChange(e.target.value)}
            />
            <span className="menu-mode-radio-group__radio-option-label">
              {mode.label}
            </span>
          </label>
        ))}
      </div>

      <div className="menu-mode-radio-group__options">
        {selectedMode === "navbar" &&
          navbarOptions.map((option) => (
            <label
              key={option.value}
              className="menu-mode-radio-group__radio-option"
            >
              <input
                type="radio"
                name="navbarOptions"
                value={option.value}
                onChange={() => onChange(option.value)}
              />
              <span className="menu-mode-radio-group__radio-option-label">
                {option.label}
              </span>
            </label>
          ))}

        {selectedMode === "sidebar" &&
          sidebarOptions.map((option) => (
            <label
              key={option.value}
              className="menu-mode-radio-group__radio-option"
            >
              <input
                type="radio"
                name="sidebarOptions"
                value={option.value}
                onChange={() => onChange(option.value)}
              />
              <span className="menu-mode-radio-group__radio-option-label">
                {option.label}
              </span>
            </label>
          ))}
      </div>
    </div>
  );
};

const ConfigMenuItem = ({ children, onClick }) => {
  return (
    <li className="config-menu__item" onClick={onClick}>
      {children}
    </li>
  );
};

const AppConfigbox = () => {
  const { layoutConfig, setLayoutConfig } = useContext(LayoutContext);
  const [activeMenu, setActiveMenu] = useState("main");
  const [menuHeight, setMenuHeight] = useState(null);
  const dropdownRef = useRef(null);

  const setMenuHeightBasedOnElement = (el) => {
    const height = el.offsetHeight;
    setMenuHeight(height);
  };

  const updateMenuMode = (value) => {
    setLayoutConfig((prevState) => ({
      ...prevState,
      menuMode: value,
    }));
  };

  const menuItems = [
    {
      key: "main",
      items: [
        {
          label: "Settings",
          icon: "cog",
          onClick: () => setActiveMenu("settings"),
        },
        {
          label: "Customize",
          icon: "palette",
          onClick: () => setActiveMenu("config"),
        },
      ],
    },
    {
      key: "config",
      items: [
        {
          label: "Back",
          icon: "arrow-left",
          onClick: () => setActiveMenu("main"),
        },
        {
          label: "Menu Mode",
          type: "section",
        },
        {
          component: (
            <MenuModeRadioGroup
              selectedMode={layoutConfig.menuMode}
              onChange={updateMenuMode}
            />
          ),
        },
        {
          label: "Scale",
          type: "section",
        },
        // {
        //   component: <LayoutSettings />,
        // },
        {
          label: "Theme",
          type: "section",
        },
        // {
        //   component: <LayoutSettings />,
        // },
      ],
    },
    {
      key: "settings",
      items: [
        {
          label: "Back",
          icon: "arrow-left",
          onClick: () => setActiveMenu("main"),
        },
        {
          component: <LayoutSettings />,
        },
      ],
    },
  ];

  return (
    <div className="config-box" ref={dropdownRef}>
      {/* <div className="config-box__header">
        <h3>Configuration</h3>
      </div> */}
      <div className="config-box__content" style={{ height: menuHeight }}>
        <CSSTransition
          in={true}
          timeout={300}
          classNames="menu"
          unmountOnExit
          onEnter={setMenuHeightBasedOnElement}
        >
          <ul className="config-menu">
            {menuItems
              ?.find((menu) => menu.key === activeMenu)
              ?.items.map((item, index) => (
                <React.Fragment key={index}>
                  {item.type === "section" && (
                    <li className="config-menu__section-header">
                      {item?.label}
                    </li>
                  )}
                  {!item.type && (
                    <ConfigMenuItem onClick={item.onClick}>
                      {item?.component || (
                        <div className="config-menu__item-content">
                          {item.icon && (
                            <i className={`pi pi-${item.icon}`}></i>
                          )}
                          <p className="config-menu__item-label">
                            {item?.label}
                          </p>
                        </div>
                      )}
                    </ConfigMenuItem>
                  )}
                </React.Fragment>
              ))}
          </ul>
        </CSSTransition>
      </div>
    </div>
  );
};

export default AppConfigbox;
