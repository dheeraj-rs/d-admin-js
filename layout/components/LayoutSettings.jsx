import React, {
  useState,
  useEffect,
  useCallback,
  useContext,
  useMemo,
} from "react";
import { LayoutContext } from "@/layout/context/layoutcontext";
import { LAYOUT_SCALES, LAYOUT_THEMES } from "@/public/layout/data";

const LayoutSettings = () => {
  const { layoutConfig, setLayoutConfig, layoutState, setLayoutState } =
    useContext(LayoutContext);
  const [activePreview, setActivePreview] = useState("layout");
  const [isAnimating, setIsAnimating] = useState(false);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 0
  );

  const DESKTOP_BREAKPOINT = 991;

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  const isDesktop = windowWidth > DESKTOP_BREAKPOINT;
  const isIE =
    typeof window !== "undefined" &&
    /(MSIE|Trident\/|Edge\/)/i.test(window.navigator.userAgent);

  const adjustScale = useCallback(
    (increment) => {
      setLayoutConfig((prev) => ({ ...prev, scale: prev.scale + increment }));
    },
    [setLayoutConfig]
  );

  const changeTheme = useCallback(
    (theme, colorScheme) => {
      if (typeof window === "undefined") return;

      const themeLink = document.getElementById("theme-css");
      const newHref = `/themes/${theme}/theme.css`;

      if (isIE) {
        themeLink.setAttribute("href", newHref);
        setLayoutConfig((prev) => ({ ...prev, theme, colorScheme }));
      } else {
        const clone = themeLink.cloneNode(true);
        clone.setAttribute("href", newHref);
        clone.setAttribute("id", "theme-css-clone");

        themeLink.parentNode.insertBefore(clone, themeLink.nextSibling);
        clone.addEventListener("load", () => {
          themeLink.remove();
          clone.setAttribute("id", "theme-css");
          setLayoutConfig((prev) => ({ ...prev, theme, colorScheme }));
        });
      }
    },
    [isIE, setLayoutConfig]
  );

  const handleLayoutChange = useCallback(
    (section, value) => {
      setIsAnimating(true);

      setLayoutState((prev) => {
        const newState = { ...prev };

        if (
          section === "isNotificationBarVisible" ||
          section === "isModalVisible"
        ) {
          newState[section] = !prev[section];
        } else if (section === "bottomBar") {
          if (value === "enabled" || value === "mobile") {
            newState.bottomBar = {
              ...prev.bottomBar,
              [value]: !prev.bottomBar[value],
            };
          } else {
            newState.bottomBar = {
              ...prev.bottomBar,
              hoverStyle: prev.bottomBar.hoverStyle === value ? null : value,
            };
          }
        } else {
          newState[section] = value;
        }

        return newState;
      });

      setTimeout(() => setIsAnimating(false), 300);
    },
    [setLayoutState]
  );

  const configSections = useMemo(
    () => ({
      navbar: {
        title: "Navbar Type",
        options: [
          { value: true, label: "Fixed" },
          { value: false, label: "Overlay" },
        ],
        section: "isNavbarFixed",
      },
      sidebar: isDesktop
        ? {
            title: "Sidebar Type",
            options: [
              { value: true, label: "Fixed" },
              { value: false, label: "Overlay" },
            ],
            section: "isSidebarFixed",
          }
        : null,
      leftSidebar: {
        title: "Left Sidebar Mode",
        options: isDesktop
          ? [
              { value: "auto", label: "Auto" },
              { value: "mini", label: "Mini" },
              { value: "auto-default", label: "Mini To Default" },
              { value: "default", label: "Default" },
            ]
          : [
              { value: "mini", label: "Mini" },
              { value: "default", label: "Default" },
            ],
        section: "leftSidebarMode",
      },
      rightSidebar: {
        title: "Right Sidebar Mode",
        options: isDesktop
          ? [
              { value: "auto", label: "Auto" },
              { value: "mini", label: "Mini" },
              { value: "auto-default", label: "Mini To Default" },
              { value: "default", label: "Default" },
            ]
          : [
              { value: "mini", label: "Mini" },
              { value: "default", label: "Default" },
            ],
        section: "rightSidebarMode",
      },
    }),
    [isDesktop]
  );

  const renderConfigButton = (
    isActive,
    onClick,
    children,
    className = "",
    key = null
  ) => (
    <button
      key={key}
      onClick={onClick}
      className={`config-button ${
        isActive ? "config-button--active" : "config-button--inactive"
      } ${className}`}
    >
      {children}
    </button>
  );

  const renderScaleControl = () => (
    <div className="scale-control">
      <button
        className="scale-control__btn scale-control__btn--decrease"
        onClick={() => adjustScale(-1)}
        disabled={layoutConfig.scale === LAYOUT_SCALES[0]}
      >
        <i className="pi pi-minus" />
      </button>
      <div className="scale-control__indicators">
        {LAYOUT_SCALES?.map((s) => (
          <div
            key={s}
            className={`scale-control__indicator ${
              s === layoutConfig.scale ? "scale-control__indicator--active" : ""
            }`}
          />
        ))}
      </div>
      <button
        className="scale-control__btn scale-control__btn--increase"
        onClick={() => adjustScale(1)}
        disabled={
          layoutConfig.scale === LAYOUT_SCALES[LAYOUT_SCALES.length - 1]
        }
      >
        <i className="pi pi-plus" />
      </button>
    </div>
  );

  const renderPreviewLayout = () => (
    <div className="preview-layout">
      {layoutState.isNotificationBarVisible && (
        <div className="preview-layout__notification-bar">
          <div className="preview-layout__notification-icon">🔔</div>
        </div>
      )}

      <div
        className={`preview-layout__navbar preview-layout__navbar--${layoutState.isNavbarFixed}`}
      />

      <div className="preview-layout__content">
        <div
          className={`
          preview-layout__sidebar 
          preview-layout__sidebar--left 
          preview-layout__sidebar--${layoutState.isSidebarLeftVisible} 
          preview-layout__sidebar--${layoutState.isSidebarRightVisible}
        `}
        />

        <div className="preview-layout__main" />

        <div
          className={`
          preview-layout__sidebar 
          preview-layout__sidebar--right 
          preview-layout__sidebar--${layoutState.isSidebarLeftVisible} 
          preview-layout__sidebar--${layoutState.isSidebarRightVisible}
        `}
        />
      </div>

      {layoutState.bottomBar.isEnabled && (
        <div
          className={`
          preview-layout__bottom-bar 
          preview-layout__bottom-bar--${
            layoutState.bottomBar.hoverStyle || "default"
          }
          ${
            layoutState.bottomBar.isMobile
              ? "preview-layout__bottom-bar--mobile"
              : ""
          }
        `}
        />
      )}
    </div>
  );

  const renderConfigSection = (
    title,
    children,
    options,
    section,
    currentValue
  ) => (
    <div className="config-section" key={title}>
      <div className="config-section__header">
        <div className="config-section__header-icon">
          <i className="pi pi-palette" />
        </div>
        <h3 className="config-section__header-title">{title}</h3>
      </div>
      <div className="config-section__grid">
        {options
          ? options.map(({ value, label }) =>
              renderConfigButton(
                currentValue === value,
                () => handleLayoutChange(section, value),
                label,
                "",
                `${section}-${value}`
              )
            )
          : children}
      </div>
    </div>
  );

  const renderAllConfigSections = () => {
    const ALL_SECTIONS = {
      scale: {
        title: "Scale Control",
        customContent: true,
        render: () => renderScaleControl(),
      },
      ...configSections,
      bottomBar: {
        title: "Bottom Bar Settings",
        customContent: true,
        render: () => (
          <>
            {renderConfigButton(
              layoutState.bottomBar.isEnabled,
              () => handleLayoutChange("bottomBar", "enabled"),
              `${
                layoutState.bottomBar.isEnabled ? "Disable" : "Enable"
              } Bottom Bar`,
              "config-button--full",
              "bottomBar-enabled"
            )}
            {isDesktop && layoutState.bottomBar.isEnabled && (
              <>
                {renderConfigButton(
                  layoutState.bottomBar.hoverStyle === "width",
                  () => handleLayoutChange("bottomBar", "width"),
                  "Width Hover Effect",
                  "",
                  "bottomBar-width"
                )}
                {renderConfigButton(
                  layoutState.bottomBar.hoverStyle === "both",
                  () => handleLayoutChange("bottomBar", "both"),
                  "Full Hover Effect",
                  "",
                  "bottomBar-both"
                )}
              </>
            )}
          </>
        ),
      },
      notificationBar: {
        title: "Notification Bar",
        customContent: true,
        render: () =>
          renderConfigButton(
            layoutState.isNotificationBarVisible,
            () => handleLayoutChange("isNotificationBarVisible"),
            `${
              layoutState.isNotificationBarVisible ? "Hide" : "Show"
            } Notification Bar`,
            "",
            "notification-toggle"
          ),
      },
      modal: {
        title: "Modal",
        customContent: true,
        render: () =>
          renderConfigButton(
            layoutState.isModalVisible,
            () => handleLayoutChange("isModalVisible"),
            `${layoutState.isModalVisible ? "Hide" : "Show"} Modal`,
            "",
            "modal-toggle"
          ),
      },
      themes: {
        title: "Themes",
        customContent: true,
        render: () => (
          <div className="theme-buttons">
            {LAYOUT_THEMES?.map(({ theme, label, scheme }) => (
              <button
                key={theme}
                className={`theme-button theme-button--${theme} ${
                  layoutConfig.theme === theme ? "theme-button--active" : ""
                }`}
                onClick={() => changeTheme(theme, scheme)}
              >
                <div className="theme-button__icon" />
                <p className="theme-button__label">{label}</p>
              </button>
            ))}
          </div>
        ),
      },
    };

    return Object.entries(ALL_SECTIONS)
      .filter(([key, section]) => key !== "themes" && section !== null)
      .map(([key, section]) =>
        renderConfigSection(
          section.title,
          section.customContent ? section.render() : null,
          !section.customContent ? section.options : null,
          section.section,
          section.section ? layoutState[section.section] : null
        )
      );
  };

  return (
    <div className={`layout-settings layout-settings--${layoutState.theme}`}>
      <div className="layout-settings__sections">
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

        <div
          className={`preview-container ${
            isAnimating ? "preview-container--animating" : ""
          } 
          ${
            layoutState.bottomBar.isEnabled
              ? "preview-container--with-bottom-bar"
              : ""
          } 
          preview-container--${layoutState.theme} preview-container--${
            layoutState.direction
          }`}
        >
          {activePreview === "layout" ? (
            renderPreviewLayout()
          ) : (
            <div className="preview-config">
              <pre className="preview-config__content">
                {JSON.stringify(layoutState, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>

      <div className="layout-settings__sections">
        <div className="mobile-settings">{renderAllConfigSections()}</div>

        <div className="mobile-settings">
          {renderConfigSection(
            "Themes",
            <div className="theme-buttons">
              {LAYOUT_THEMES?.map(({ theme, label, scheme }) => (
                <button
                  key={theme}
                  className={`theme-button theme-button--${theme} ${
                    layoutConfig.theme === theme ? "theme-button--active" : ""
                  }`}
                  onClick={() => changeTheme(theme, scheme)}
                >
                  <div className="theme-button__icon" />
                  <p className="theme-button__label">{label}</p>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LayoutSettings;
