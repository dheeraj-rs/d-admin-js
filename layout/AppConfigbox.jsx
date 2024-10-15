import React, { useState, useRef, useContext, useEffect } from "react";
import { CSSTransition } from "react-transition-group";
import { LayoutContext } from "./context/layoutcontext";

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
      <div className="mode-selection2">
        {modes.map((mode) => (
          <label key={mode.value} className="radio-option2">
            <input
              type="radio"
              name="menuMode"
              value={mode.value}
              checked={selectedMode === mode.value}
              onChange={(e) => onChange(e.target.value, mode.value)}
            />
            <p className="radio-label">{mode.label}</p>
          </label>
        ))}
      </div>

      {selectedMode === "navbar"}

      {selectedMode === "navbar" && (
        <div className="navbar-options">
          {navbarOptions.map((option) => (
            <label key={option.value} className="radio-option2">
              <input
                type="radio"
                name="navbarOptions"
                value={option.value}
                onChange={() => onChange(option.value, selectedMode)}
              />
              <p className="radio-label2">{option.label}</p>
            </label>
          ))}
        </div>
      )}

      {selectedMode === "sidebar" && (
        <div className="sidebar-options">
          {sidebarOptions.map((option) => (
            <label key={option.value} className="radio-option2">
              <input
                type="radio"
                name="sidebarOptions"
                value={option.value}
                onChange={() => onChange(option.value, selectedMode)}
              />
              <p className="radio-label2">{option.label}</p>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

const ConfigMenuItem = ({ children, onClick }) => {
  return (
    <li className="config-menu-item" onClick={onClick}>
      {children}
    </li>
  );
};

const ScaleControl = ({ scale, onIncrease, onDecrease, scales }) => {
  return (
    <div className="scale-control">
      <button
        className="scale-btn decrease"
        onClick={onDecrease}
        disabled={scale === scales[0]}
      >
        <i className="pi pi-minus"></i>
      </button>
      <div className="scale-indicators">
        {scales.map((s) => (
          <div
            key={s}
            className={`scale-indicator ${s === scale ? "active" : ""}`}
          />
        ))}
      </div>
      <button
        className="scale-btn increase"
        onClick={onIncrease}
        disabled={scale === scales[scales.length - 1]}
      >
        <i className="pi pi-plus"></i>
      </button>
    </div>
  );
};

const ThemeButton = ({ theme, label, isActive, onClick }) => {
  return (
    <button
      className={`theme-button ${theme} ${isActive ? "active" : ""}`}
      onClick={onClick}
    >
      <div className="theme-icon"></div>
      <p>{label}</p>
    </button>
  );
};

const AppConfigbox = () => {
  const { layoutConfig, setLayoutConfig } = useContext(LayoutContext);
  const [activeMenu, setActiveMenu] = useState("main");
  const [menuHeight, setMenuHeight] = useState(null);
  const dropdownRef = useRef(null);
  const [scales] = useState([12, 13, 14, 15, 16]);

  const setMenuHeightBasedOnElement = (el) => {
    const height = el.offsetHeight;
    setMenuHeight(height);
  };

  const updateMenuMode = (value, type) => {
    console.log("value :", value);
    console.log("type :", type);
    setLayoutConfig((prevState) => ({
      ...prevState,
      menuMode: value,
    }));
  };

  const adjustScale = (increment) => {
    setLayoutConfig((prevState) => ({
      ...prevState,
      scale: prevState.scale + increment,
    }));
  };

  const changeTheme = (theme, colorScheme) => {
    const themeLink = document.getElementById("theme-css");
    const newHref = `/themes/${theme}/theme.css`;
    replaceLink(themeLink, newHref);
    setLayoutConfig((prevState) => ({ ...prevState, theme, colorScheme }));
  };

  const isIE = () => {
    return /(MSIE|Trident\/|Edge\/)/i.test(window.navigator.userAgent);
  };

  const replaceLink = (linkElement, href, callback) => {
    if (isIE()) {
      linkElement.setAttribute("href", href);
      if (callback) {
        callback();
      }
    } else {
      const id = linkElement.getAttribute("id");
      const cloneLinkElement = linkElement.cloneNode(true);
      cloneLinkElement.setAttribute("href", href);
      cloneLinkElement.setAttribute("id", id + "-clone");
      linkElement.parentNode.insertBefore(
        cloneLinkElement,
        linkElement.nextSibling
      );
      cloneLinkElement.addEventListener("load", () => {
        linkElement.remove();
        cloneLinkElement.setAttribute("id", id);
        if (callback) {
          callback();
        }
      });
    }
  };

  useEffect(() => {
    document.documentElement.style.fontSize = layoutConfig.scale + "px";
  }, [layoutConfig.scale]);

  const themes = [
    { theme: "lara-light-indigo", label: "Light Indigo", scheme: "light" },
    { theme: "lara-dark-indigo", label: "Dark Indigo", scheme: "dark" },
    { theme: "lara-light-teal", label: "Light Teal", scheme: "light" },
    { theme: "lara-dark-teal", label: "Dark Teal", scheme: "dark" },
  ];

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
        {
          component: (
            <ScaleControl
              scale={layoutConfig.scale}
              scales={scales}
              onIncrease={() => adjustScale(1)}
              onDecrease={() => adjustScale(-1)}
            />
          ),
        },
        {
          label: "Theme",
          type: "section",
        },
        {
          component: (
            <div className="theme-buttons">
              {themes.map(({ theme, label, scheme }) => (
                <ThemeButton
                  key={theme}
                  theme={theme}
                  label={label}
                  isActive={layoutConfig.theme === theme}
                  onClick={() => changeTheme(theme, scheme)}
                />
              ))}
            </div>
          ),
        },
      ],
    },
  ];

  return (
    <div className="config-box" ref={dropdownRef}>
      <div className="config-box-header">
        <h3>Configuration</h3>
      </div>
      <div className="config-box-content" style={{ height: menuHeight }}>
        <CSSTransition
          in={true}
          timeout={300}
          classNames="menu"
          unmountOnExit
          onEnter={setMenuHeightBasedOnElement}
        >
          <ul className="config-menu">
            {menuItems
              .find((menu) => menu.key === activeMenu)
              ?.items.map((item, index) => (
                <React.Fragment key={index}>
                  {item.type === "section" && (
                    <li className="section-header">{item.label}</li>
                  )}
                  {!item.type && (
                    <ConfigMenuItem onClick={item.onClick}>
                      {item.component || (
                        <div className="menu-item-content">
                          {item.icon && (
                            <i className={`pi pi-${item.icon}`}></i>
                          )}
                          <p className="config-item-label">{item.label}</p>
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
