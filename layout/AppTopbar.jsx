import React, { forwardRef, useContext, useCallback, memo } from "react";
import { LayoutContext } from "./context/layoutcontext";
import { classNames, Dropdown } from "@/utils";
import { menuitem } from "@/public/layout/data";
import AppConfigbox from "./AppConfigbox";

// Separate NavbarItem into a memoized component
const NavbarItem = memo(({ item }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const handleMouseEnter = useCallback(() => setIsOpen(true), []);
  const handleMouseLeave = useCallback(() => setIsOpen(false), []);

  if (!item) return null;

  const renderIcon = (iconClass) => iconClass && <i className={iconClass} />;

  if (item.items) {
    return (
      <li
        className="navbar-item"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <span className="navbar-link">
          {renderIcon(item.icon)}
          {item.label}
          <i className="pi pi-angle-down" />
        </span>
        {isOpen && (
          <ul className="navbar-submenu">
            {item.items.map((subItem, index) => (
              <NavbarItem key={`${subItem.label}-${index}`} item={subItem} />
            ))}
          </ul>
        )}
      </li>
    );
  }

  return (
    <li className="navbar-item">
      <a href={item.to} className="navbar-link" target={item.target}>
        {renderIcon(item.icon)}
        {item.label}
      </a>
    </li>
  );
});

NavbarItem.displayName = "NavbarItem";

// Separate TopbarButton into a forwarded ref component
const TopbarButton = forwardRef(
  ({ icon, onClick, label, className = "" }, ref) => (
    <button
      ref={ref}
      type="button"
      className={`p-link layout-topbar-button ${className}`}
      onClick={onClick}
    >
      <i className={`pi ${icon}`} />
      {label && <span>{label}</span>}
    </button>
  )
);

TopbarButton.displayName = "TopbarButton";

const AppTopbar = forwardRef((props, ref) => {
  const { layoutConfig, onMenuToggle, setLayoutConfig } =
    useContext(LayoutContext);

  // Create individual refs
  const menuButtonRef = React.useRef(null);
  const topbarMenuRef = React.useRef(null);
  const topbarMenuButtonRef = React.useRef(null);

  // Expose refs through useImperativeHandle
  React.useImperativeHandle(ref, () => ({
    menubutton: menuButtonRef.current,
    topbarmenu: topbarMenuRef.current,
    topbarmenubutton: topbarMenuButtonRef.current,
  }));

  const toggleConfig = useCallback(() => {
    setLayoutConfig((prevState) => ({
      ...prevState,
      configSidebarVisible: !prevState.configSidebarVisible,
    }));
  }, [setLayoutConfig]);

  const handleLeftMenuToggle = useCallback(() => {
    onMenuToggle("left");
  }, [onMenuToggle]);

  const handleRightMenuToggle = useCallback(() => {
    onMenuToggle("right");
  }, [onMenuToggle]);

  const topbarMenuClassName = classNames("layout-topbar-menu", {
    "layout-topbar-menu-mobile-active": layoutConfig.profileSidebarVisible,
  });

  return (
    <div className="topbar-main">
      <div className="topbar-header">
        <nav className="breadcrumb">
          <span className="breadcrumb-link">Pages</span> / Main Page
        </nav>
        <h1 className="title">Main Page</h1>
      </div>

      <TopbarButton
        ref={menuButtonRef}
        icon="pi-bars"
        onClick={handleLeftMenuToggle}
        className="layout-menu-button"
      />

      <ul className="navbar-menu">
        {menuitem.map((item, index) => (
          <NavbarItem key={`${item.label}-${index}`} item={item} />
        ))}
      </ul>

      <div ref={topbarMenuRef} className={topbarMenuClassName}>
        <TopbarButton
          ref={topbarMenuButtonRef}
          icon="pi-bars"
          onClick={handleRightMenuToggle}
        />
        <TopbarButton icon="pi-user" onClick={toggleConfig} label="Profile" />
        <Dropdown
          button={<i className="pi pi-cog" />}
          className="p-link layout-topbar-button"
        >
          <AppConfigbox />
        </Dropdown>
      </div>
    </div>
  );
});

AppTopbar.displayName = "AppTopbar";

export default memo(AppTopbar);
