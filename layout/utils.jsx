import React, { useContext, useEffect, useMemo, useState } from "react";
import { LayoutContext } from "./context/layoutcontext";
import { menuitem } from "@/public/layout/data";

export const LayoutSettings = () => {
  const { layoutConfig, setLayoutConfig, layoutState, setLayoutState } =
    useContext(LayoutContext);

  const [activePreview, setActivePreview] = useState("layout");
  const [isAnimating, setIsAnimating] = useState(false);

  const [scales] = useState([12, 13, 14, 15, 16]);

  const themes = [
    { theme: "lara-light-indigo", label: "Light Indigo", scheme: "light" },
    { theme: "lara-dark-indigo", label: "Dark Indigo", scheme: "dark" },
    { theme: "lara-light-teal", label: "Light Teal", scheme: "light" },
    { theme: "lara-dark-teal", label: "Dark Teal", scheme: "dark" },
  ];

  const adjustScale = (increment) => {
    setLayoutConfig((prevState) => ({
      ...prevState,
      scale: prevState.scale + increment,
    }));
  };

  const ScaleControl = ({ scale, onIncrease, onDecrease, scales }) => {
    return (
      <div className="scale-control">
        <button
          className="scale-control__btn scale-control__btn--decrease"
          onClick={onDecrease}
          disabled={scale === scales[0]}
        >
          <i className="pi pi-minus"></i>
        </button>
        <div className="scale-control__indicators">
          {scales.map((s) => (
            <div
              key={s}
              className={`scale-control__indicator ${
                s === scale ? "scale-control__indicator--active" : ""
              }`}
            />
          ))}
        </div>
        <button
          className="scale-control__btn scale-control__btn--increase"
          onClick={onIncrease}
          disabled={scale === scales[scales.length - 1]}
        >
          <i className="pi pi-plus"></i>
        </button>
      </div>
    );
  };
  useEffect(() => {
    document.documentElement.style.fontSize = layoutConfig.scale + "px";
  }, [layoutConfig.scale]);
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
      const clonedLink = linkElement.cloneNode(true);

      clonedLink.setAttribute("href", href);
      clonedLink.setAttribute("id", id + "-clone");

      linkElement.parentNode.insertBefore(clonedLink, linkElement.nextSibling);

      clonedLink.addEventListener("load", () => {
        linkElement.remove();
        clonedLink.setAttribute("id", id);

        if (callback) {
          callback();
        }
      });
    }
  };

  const changeTheme = (theme, colorScheme) => {
    const themeLink = document.getElementById("theme-css");
    const newHref = `/themes/${theme}/theme.css`;
    replaceLink(themeLink, newHref);
    setLayoutConfig((prevState) => ({ ...prevState, theme, colorScheme }));
  };

  const ThemeButton = ({ theme, label, isActive, onClick }) => {
    return (
      <button
        className={`theme-button theme-button--${theme} ${
          isActive ? "theme-button--active" : ""
        }`}
        onClick={onClick}
      >
        <div className="theme-button__icon"></div>
        <p className="theme-button__label">{label}</p>
      </button>
    );
  };

  const handleLayoutChange = (section, value) => {
    setIsAnimating(true);

    if (section === "notificationBar") {
      setLayoutState((prev) => ({
        ...prev,
        notificationBar: !prev.notificationBar,
      }));
    } else if (section === "modalActive") {
      setLayoutState((prev) => ({
        ...prev,
        modalActive: !prev.modalActive,
      }));
    } else if (section === "bottomBar") {
      if (value === "enabled" || value === "mobile") {
        setLayoutState((prev) => ({
          ...prev,
          bottomBar: {
            ...prev.bottomBar,
            [value]: !prev.bottomBar[value],
          },
        }));
      } else if (value === "width" || value === "both") {
        setLayoutState((prev) => ({
          ...prev,
          bottomBar: {
            ...prev.bottomBar,
            hoverStyle: prev.bottomBar.hoverStyle === value ? null : value,
          },
        }));
      }
    } else {
      setLayoutState((prev) => ({
        ...prev,
        [section]: value,
      }));
    }

    setTimeout(() => setIsAnimating(false), 300);
  };

  const PreviewSlider = () => {
    const containerClasses = [
      "preview-container",
      isAnimating ? "preview-container--animating" : "",
      layoutState.bottomBar.enabled ? "preview-container--with-bottom-bar" : "",
      `preview-container--${layoutState.theme}`,
      `preview-container--${layoutState.direction}`,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div className="preview-section">
        <div className="preview-section__nav">
          <button
            onClick={() => setActivePreview("layout")}
            className={`preview-button ${
              activePreview === "layout"
                ? "preview-button--active"
                : "preview-button--inactive"
            }`}
          >
            Layout Preview
          </button>
          <button
            onClick={() => setActivePreview("config")}
            className={`preview-button ${
              activePreview === "config"
                ? "preview-button--active"
                : "preview-button--inactive"
            }`}
          >
            Configuration
          </button>
        </div>

        <div className={containerClasses}>
          {activePreview === "layout" && (
            <div className="preview-layout">
              {layoutState.notificationBar && (
                <div className="preview-layout__notification-bar">
                  <div className="preview-layout__notification-icon">🔔</div>
                </div>
              )}

              <div
                className={`preview-layout__navbar preview-layout__navbar--${layoutState.navbarMode}`}
              />

              <div className="preview-layout__content">
                <div
                  className={`
                preview-layout__sidebar 
                preview-layout__sidebar--left 
                preview-layout__sidebar--${layoutState.leftSidebarMode} 
                preview-layout__sidebar--${layoutState.sidebarMode}
              `}
                />

                <div className="preview-layout__main" />

                <div
                  className={`
                preview-layout__sidebar 
                preview-layout__sidebar--right 
                preview-layout__sidebar--${layoutState.rightSidebarMode} 
                preview-layout__sidebar--${layoutState.sidebarMode}
              `}
                />
              </div>

              {layoutState.bottomBar.enabled && (
                <div
                  className={`
                preview-layout__bottom-bar 
                preview-layout__bottom-bar--${
                  layoutState.bottomBar.hoverStyle || "default"
                }
                ${
                  layoutState.bottomBar.mobile
                    ? "preview-layout__bottom-bar--mobile"
                    : ""
                }
              `}
                />
              )}
            </div>
          )}

          {activePreview === "config" && (
            <div className="preview-config">
              <pre className="preview-config__content">
                {JSON.stringify(layoutState, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    );
  };

  const ConfigButton = ({ isActive, onClick, children, className = "" }) => (
    <button
      onClick={onClick}
      className={`config-button ${
        isActive ? "config-button--active" : "config-button--inactive"
      } ${className}`}
    >
      {children}
    </button>
  );

  const ConfigSection = ({ title, options, section, currentValue }) => (
    <div className="config-section">
      <div className="config-section__header">
        <div className="config-section__header-icon">📂</div>
        <h3 className="config-section__header-title">{title}</h3>
      </div>
      <div className="config-section__grid">
        {options.map(({ value, label }) => (
          <ConfigButton
            key={value}
            isActive={currentValue === value}
            onClick={() => handleLayoutChange(section, value)}
          >
            {label}
          </ConfigButton>
        ))}
      </div>
    </div>
  );

  const isDesktop = () => {
    return window.innerWidth > 991;
  };

  return (
    <div
      className="layout-settings layout-settings--${layoutState.theme}"
      style={{ width: "300px", height: "60vh", overflowY: "auto" }}
    >
      {/* <div className="layout-settings__header">
        <h2 className="layout-settings__header-title">📐 Layout Settings</h2>
      </div> */}

      <div className="layout-settings__content">
        <PreviewSlider />

        <div className="layout-settings__sections">
          <div className="config-section mobile-settings">
            <div className="config-section">
              <div className="config-section__header">
                <div className="config-section__header-icon">📂</div>
                <h3 className="config-section__header-title">Scale Control</h3>
              </div>
              <ScaleControl
                scale={layoutConfig.scale}
                scales={scales}
                onIncrease={() => adjustScale(1)}
                onDecrease={() => adjustScale(-1)}
              />
            </div>

            <ConfigSection
              title="Navbar Type"
              options={[
                { value: true, label: "Fixed" },
                { value: false, label: "Overlay" },
                // { value: null, label: "Hidden" },
              ]}
              section="navbarMode"
              currentValue={layoutState.navbarMode}
            />

            {isDesktop() && (
              <ConfigSection
                title="Sidebar Type"
                options={
                  isDesktop()
                    ? [
                        { value: true, label: "Fixed" },
                        { value: false, label: "Overlay" },
                      ]
                    : []
                }
                section="sidebarMode"
                currentValue={layoutState.sidebarMode}
              />
            )}

            <ConfigSection
              title="Left Sidebar Mode"
              options={
                isDesktop()
                  ? [
                      { value: "auto", label: "Auto" },
                      { value: "mini", label: "Mini" },
                      {
                        value: "auto-default",
                        label: "Mini To Default",
                      },
                      { value: "default", label: "Default" },
                    ]
                  : [
                      { value: "mini", label: "Mini" },
                      { value: "default", label: "Default" },
                    ]
              }
              section="leftSidebarMode"
              currentValue={layoutState.leftSidebarMode}
            />

            <ConfigSection
              title="Right Sidebar Mode"
              options={
                isDesktop()
                  ? [
                      { value: "auto", label: "Auto" },
                      { value: "mini", label: "Mini" },
                      {
                        value: "auto-default",
                        label: "Mini To Default",
                      },
                      { value: "default", label: "Default" },
                    ]
                  : [
                      { value: "mini", label: "Mini" },
                      { value: "default", label: "Default" },
                    ]
              }
              section="rightSidebarMode"
              currentValue={layoutState.rightSidebarMode}
            />

            <div className="config-section ">
              <div className="config-section__header">
                <div className="config-section__header-icon">📉</div>
                <h3 className="config-section__header-title">
                  Bottom Bar Settings
                </h3>
              </div>

              <div className="config-section__controls">
                <ConfigButton
                  isActive={layoutState.bottomBar.enabled}
                  onClick={() => handleLayoutChange("bottomBar", "enabled")}
                  className="config-button--full"
                >
                  {layoutState.bottomBar.enabled ? "Disable" : "Enable"} Bottom
                  Bar
                </ConfigButton>

                {isDesktop() && layoutState.bottomBar.enabled && (
                  <>
                    <ConfigButton
                      isActive={layoutState.bottomBar.hoverStyle === "width"}
                      onClick={() => handleLayoutChange("bottomBar", "width")}
                    >
                      Width Hover Effect
                    </ConfigButton>
                    <ConfigButton
                      isActive={layoutState.bottomBar.hoverStyle === "both"}
                      onClick={() => handleLayoutChange("bottomBar", "both")}
                    >
                      Full Hover Effect
                    </ConfigButton>
                  </>
                )}
              </div>
            </div>

            <div className="config-section">
              <div className="config-section__header">
                <div className="config-section__header-icon">🔔</div>
                <h3 className="config-section__header-title">
                  Notification Bar
                </h3>
              </div>
              <ConfigButton
                isActive={layoutState.notificationBar}
                onClick={() => handleLayoutChange("notificationBar")}
              >
                {layoutState.notificationBar
                  ? "Hide Notification Bar"
                  : "Show Notification Bar"}
              </ConfigButton>
            </div>
            <div className="config-section">
              <div className="config-section__header">
                <div className="config-section__header-icon">🏞️</div>
                <h3 className="config-section__header-title">modal</h3>
              </div>
              <ConfigButton
                isActive={layoutState.modalActive}
                onClick={() => handleLayoutChange("modalActive")}
              >
                {layoutState.modalActive ? "Hide modal" : "Show modal"}
              </ConfigButton>
            </div>
          </div>

          {/* <div className="config-section mobile-settings">
            <ConfigSection
              title="Mobile Left Sidebar"
              options={[
                { value: "m-mini", label: "Mini" },
                { value: "m-default", label: "Default" },
              ]}
              section="mobileLeftSidebarMode"
              currentValue={layoutState.mobileLeftSidebarMode}
              // icon={ArrowLeft}
            />

            <ConfigSection
              title="Mobile Right Sidebar"
              options={[
                { value: "m-mini", label: "Mini" },
                { value: "m-default", label: "Default" },
              ]}
              section="mobileRightSidebarMode"
              currentValue={layoutState.mobileRightSidebarMode}
              // icon={ArrowRight}
            />

            <ConfigSection
              title="Mobile Bottom Bar"
              options={[
                { value: true, label: "Enable" },
                { value: false, label: "Disable" },
              ]}
              section="mobileBottomBar"
              currentValue={layoutState.mobileBottomBar}
              // icon={Menu}
            />
          </div> */}

          <div className="config-section mobile-settings">
            <div className="config-section__header">
              <div className="config-section__header-icon">📂</div>
              <h3 className="config-section__header-title">Thems</h3>
            </div>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export const Dropdown = (props) => {
  const { button, children, animation, className } = props;
  const wrapperRef = React.useRef(null);
  const [openWrapper, setOpenWrapper] = React.useState(false);
  useOutsideAlerter(wrapperRef, setOpenWrapper);

  return (
    <div ref={wrapperRef} className={`dropdown ${className}`}>
      <div
        className="dropdown__button"
        onMouseDown={() => setOpenWrapper(!openWrapper)}
      >
        {button}
      </div>
      <div
        className={`dropdown__content ${animation ? animation : ""} ${
          openWrapper ? "dropdown__content--open" : "dropdown__content--closed"
        }`}
      >
        {children}
      </div>
    </div>
  );
};

export const LayoutSearchbar = ({ searchbarRef }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const { layoutState, setLayoutState } = useContext(LayoutContext);

  // Filter menu items based on search term
  const filterMenuItems = (items, term) => {
    return items
      ?.map((item) => {
        if (item.seperator) return item;

        const matchesSearch = item.label
          .toLowerCase()
          .includes(term.toLowerCase());
        const filteredItems = item.items
          ? filterMenuItems(item.items, term)
          : null;

        if (matchesSearch || (filteredItems && filteredItems.length > 0)) {
          return {
            ...item,
            items: filteredItems,
          };
        }

        return null;
      })
      .filter(Boolean);
  };

  // Memoize filtered menu items to avoid recalculating on each render
  const filteredMenuItems = useMemo(
    () => (searchTerm ? filterMenuItems(menuitem, searchTerm) : []),
    [searchTerm, menuitem]
  );

  // Update layout state only when filteredMenuItems changes
  useMemo(() => {
    setLayoutState((prevState) => ({
      ...prevState,
      searchSidebarItems: filteredMenuItems,
    }));
  }, [filteredMenuItems, setLayoutState]);

  const hasSearchResults = filteredMenuItems?.length > 0;
  console.log("searchSidebarItems :", layoutState?.searchSidebarItems);

  return (
    <div ref={searchbarRef} className="layout__searchbar">
      <div className="searchbar-container">
        <input
          type="text"
          className="searchbar-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search menu items..."
          spellCheck="false"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              console.log(searchTerm);
            }
          }}
        />
        <div className="icon-container">
          <div className="icon">
            {searchTerm && !hasSearchResults ? (
              <i
                className="pi pi-exclamation-triangle"
                style={searchTerm && !hasSearchResults ? { color: "red" } : {}}
              ></i>
            ) : (
              <i className="pi pi-search search-icon"></i>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
