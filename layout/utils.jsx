import React, {
  useContext,
  useState,
  useCallback,
  useMemo,
  memo,
  useEffect,
} from "react";
import { LayoutContext } from "./context/layoutcontext";
import { menuitem } from "@/public/layout/data";

// Memoized child components with explicit display names
const ScaleControl = memo(({ scale, onIncrease, onDecrease, scales }) => (
  <div className="scale-control">
    <button
      className="scale-control__btn scale-control__btn--decrease"
      onClick={onDecrease}
      disabled={scale === scales[0]}
    >
      <i className="pi pi-minus" />
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
      <i className="pi pi-plus" />
    </button>
  </div>
));
ScaleControl.displayName = "ScaleControl";

const ThemeButton = memo(({ theme, label, isActive, onClick }) => (
  <button
    className={`theme-button theme-button--${theme} ${
      isActive ? "theme-button--active" : ""
    }`}
    onClick={onClick}
  >
    <div className="theme-button__icon" />
    <p className="theme-button__label">{label}</p>
  </button>
));
ThemeButton.displayName = "ThemeButton";

const ConfigButton = memo(({ isActive, onClick, children, className = "" }) => (
  <button
    onClick={onClick}
    className={`config-button ${
      isActive ? "config-button--active" : "config-button--inactive"
    } ${className}`}
  >
    {children}
  </button>
));
ConfigButton.displayName = "ConfigButton";

const ConfigSection = memo(
  ({ title, children, options, section, currentValue, onChange }) => (
    <div className="config-section">
      <div className="config-section__header">
        <div className="config-section__header-icon">
          <i className="pi pi-palette"></i>
        </div>
        <h3 className="config-section__header-title">{title}</h3>
      </div>
      <div className="config-section__grid">
        {options
          ? options.map(({ value, label }) => (
              <ConfigButton
                key={value}
                isActive={currentValue === value}
                onClick={() => onChange(section, value)}
              >
                {label}
              </ConfigButton>
            ))
          : children}
      </div>
    </div>
  )
);
ConfigSection.displayName = "ConfigSection";

const PreviewLayout = memo(({ layoutState }) => (
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
));
PreviewLayout.displayName = "PreviewLayout";

// Constants
const SCALES = [10, 11, 12, 13, 14];
const THEMES = [
  { theme: "lara-light-indigo", label: "Light Indigo", scheme: "light" },
  { theme: "lara-dark-indigo", label: "Dark Indigo", scheme: "dark" },
  { theme: "lara-light-teal", label: "Light Teal", scheme: "light" },
  { theme: "lara-dark-teal", label: "Dark Teal", scheme: "dark" },
];
const DESKTOP_BREAKPOINT = 991;

// Custom hook for handling outside clicks
const useOutsideAlerter = (ref, setOpen) => {
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, setOpen]);
};

// Dropdown Component
export const Dropdown = memo(({ button, children, animation, className }) => {
  const wrapperRef = React.useRef(null);
  const [openWrapper, setOpenWrapper] = useState(false);
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
        className={`dropdown__content ${animation || ""} ${
          openWrapper ? "dropdown__content--open" : "dropdown__content--closed"
        }`}
      >
        {children}
      </div>
    </div>
  );
});
Dropdown.displayName = "Dropdown";

// Searchbar Component
export const LayoutSearchbar = memo(({ searchbarRef }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const { setLayoutState } = useContext(LayoutContext);

  const filterMenuItems = useCallback((items, term) => {
    if (!term) return [];

    return items?.reduce((filtered, item) => {
      if (item.seperator) return [...filtered, item];

      const matchesSearch = item.label
        .toLowerCase()
        .includes(term.toLowerCase());
      const filteredChildren = item.items
        ? filterMenuItems(item.items, term)
        : [];

      if (matchesSearch || filteredChildren.length > 0) {
        return [...filtered, { ...item, items: filteredChildren }];
      }
      return filtered;
    }, []);
  }, []);

  useEffect(() => {
    const filteredItems = filterMenuItems(menuitem, searchTerm);
    setLayoutState((prev) => ({
      ...prev,
      searchSidebarItems: filteredItems,
    }));
  }, [searchTerm, filterMenuItems, setLayoutState]);

  const hasResults = useMemo(() => {
    return filterMenuItems(menuitem, searchTerm).length > 0;
  }, [searchTerm, filterMenuItems]);

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
            <i
              className={`pi ${
                searchTerm && !hasResults
                  ? "pi-exclamation-triangle"
                  : "pi-search"
              }`}
              style={searchTerm && !hasResults ? { color: "red" } : {}}
            />
          </div>
        </div>
      </div>
    </div>
  );
});
LayoutSearchbar.displayName = "LayoutSearchbar";

// Main Layout Settings Component
export const LayoutSettings = memo(() => {
  const { layoutConfig, setLayoutConfig, layoutState, setLayoutState } =
    useContext(LayoutContext);
  const [activePreview, setActivePreview] = useState("layout");
  const [isAnimating, setIsAnimating] = useState(false);

  const isDesktop = useMemo(() => window.innerWidth > DESKTOP_BREAKPOINT, []);
  const isIE = useMemo(
    () => /(MSIE|Trident\/|Edge\/)/i.test(window.navigator.userAgent),
    []
  );

  const adjustScale = useCallback(
    (increment) => {
      setLayoutConfig((prev) => ({
        ...prev,
        scale: prev.scale + increment,
      }));
    },
    [setLayoutConfig]
  );

  const changeTheme = useCallback(
    (theme, colorScheme) => {
      const themeLink = document.getElementById("theme-css");
      const newHref = `/themes/${theme}/theme.css`;

      const applyTheme = () => {
        setLayoutConfig((prev) => ({ ...prev, theme, colorScheme }));
      };

      if (isIE) {
        themeLink.setAttribute("href", newHref);
        applyTheme();
      } else {
        const clone = themeLink.cloneNode(true);
        clone.setAttribute("href", newHref);
        clone.setAttribute("id", "theme-css-clone");

        themeLink.parentNode.insertBefore(clone, themeLink.nextSibling);
        clone.addEventListener("load", () => {
          themeLink.remove();
          clone.setAttribute("id", "theme-css");
          applyTheme();
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

        if (section === "notificationBar" || section === "modalActive") {
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

      const timer = setTimeout(() => setIsAnimating(false), 300);
      return () => clearTimeout(timer);
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
        section: "navbarMode",
      },
      sidebar: isDesktop
        ? {
            title: "Sidebar Type",
            options: [
              { value: true, label: "Fixed" },
              { value: false, label: "Overlay" },
            ],
            section: "sidebarMode",
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

  const containerClasses = useMemo(() => {
    return [
      "preview-container",
      isAnimating && "preview-container--animating",
      layoutState.bottomBar.enabled && "preview-container--with-bottom-bar",
      `preview-container--${layoutState.theme}`,
      `preview-container--${layoutState.direction}`,
    ]
      .filter(Boolean)
      .join(" ");
  }, [
    isAnimating,
    layoutState.bottomBar.enabled,
    layoutState.theme,
    layoutState.direction,
  ]);

  const ALL_SECTIONS = {
    scale: {
      title: "Scale Control",
      customContent: true,
      render: (props) => (
        <ScaleControl
          scale={props.layoutConfig.scale}
          scales={SCALES}
          onIncrease={() => props.adjustScale(1)}
          onDecrease={() => props.adjustScale(-1)}
        />
      ),
    },
    // Add existing config sections
    ...configSections,
    bottomBar: {
      title: "Bottom Bar Settings",
      customContent: true,
      render: (props) => (
        <>
          <ConfigButton
            isActive={props.layoutState.bottomBar.enabled}
            onClick={() => props.handleLayoutChange("bottomBar", "enabled")}
            className="config-button--full"
          >
            {props.layoutState.bottomBar.enabled ? "Disable" : "Enable"} Bottom
            Bar
          </ConfigButton>

          {props.isDesktop && props.layoutState.bottomBar.enabled && (
            <>
              <ConfigButton
                isActive={props.layoutState.bottomBar.hoverStyle === "width"}
                onClick={() => props.handleLayoutChange("bottomBar", "width")}
              >
                Width Hover Effect
              </ConfigButton>
              <ConfigButton
                isActive={props.layoutState.bottomBar.hoverStyle === "both"}
                onClick={() => props.handleLayoutChange("bottomBar", "both")}
              >
                Full Hover Effect
              </ConfigButton>
            </>
          )}
        </>
      ),
    },
    notificationBar: {
      title: "Notification Bar",
      customContent: true,
      render: (props) => (
        <ConfigButton
          isActive={props.layoutState.notificationBar}
          onClick={() => props.handleLayoutChange("notificationBar")}
        >
          {props.layoutState.notificationBar ? "Hide" : "Show"} Notification Bar
        </ConfigButton>
      ),
    },
    modal: {
      title: "Modal",
      customContent: true,
      render: (props) => (
        <ConfigButton
          isActive={props.layoutState.modalActive}
          onClick={() => props.handleLayoutChange("modalActive")}
        >
          {props.layoutState.modalActive ? "Hide" : "Show"} Modal
        </ConfigButton>
      ),
    },
    themes: {
      title: "Themes",
      customContent: true,
      render: (props) => (
        <div className="theme-buttons">
          {THEMES.map(({ theme, label, scheme }) => (
            <ThemeButton
              key={theme}
              theme={theme}
              label={label}
              isActive={props.layoutConfig.theme === theme}
              onClick={() => props.changeTheme(theme, scheme)}
            />
          ))}
        </div>
      ),
    },
  };

  return (
    <div className={`layout-settings layout-settings--${layoutState.theme}`}>
      <div className="layout-settings__sectionst">
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
            <PreviewLayout layoutState={layoutState} />
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

      <div className="layout-settings__sections">
        <div className="mobile-settings">
          {Object.entries(ALL_SECTIONS)
            .filter(([key, section]) => key !== "themes" && section !== null)
            .map(([key, section]) => (
              <ConfigSection key={key} title={section.title}>
                {section.customContent ? (
                  section.render({
                    layoutConfig,
                    layoutState,
                    handleLayoutChange,
                    adjustScale,
                    isDesktop,
                    changeTheme,
                  })
                ) : (
                  <React.Fragment>
                    {section.options?.map(({ value, label }) => (
                      <ConfigButton
                        key={value}
                        isActive={layoutState[section.section] === value}
                        onClick={() =>
                          handleLayoutChange(section.section, value)
                        }
                      >
                        {label}
                      </ConfigButton>
                    ))}
                  </React.Fragment>
                )}
              </ConfigSection>
            ))}
        </div>

        <div className="mobile-settings">
          <ConfigSection title={ALL_SECTIONS.themes.title}>
            {ALL_SECTIONS.themes.render({
              layoutConfig,
              changeTheme,
            })}
          </ConfigSection>
        </div>
      </div>
    </div>
  );
});

// Add display name to main component
LayoutSettings.displayName = "LayoutSettings";
