"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useContext, useRef } from "react";
import { CSSTransition } from "react-transition-group";
import { MenuContext } from "./context/menucontext";
import { LayoutContext } from "./context/layoutcontext";
import { classNames, Ripple } from "@/utils";

const AppMenuItem = ({ item, index, parentKey, root, className }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { activeMenu, setActiveMenu } = useContext(MenuContext);
  const { setMouseOverLabelName, layoutState } = useContext(LayoutContext);
  const nodeRef = useRef(null);

  // Generate unique key for menu item
  const key = parentKey ? `${parentKey}-${index}` : String(index);

  // Check if current route is active
  const isActiveRoute = item?.to && pathname === item?.to;
  const isActive = activeMenu === key || activeMenu.startsWith(`${key}-`);

  // Common menu item styles
  const menuItemStyles = {
    overflow: "hidden",
    position: "relative",
  };

  // Common props for both Link and anchor elements
  const commonProps = {
    className: classNames(item?.className, "p-ripple", {
      "active-route": isActiveRoute,
    }),
    style: menuItemStyles,
    tabIndex: 0,
    ...(shouldShowTooltip(layoutState) && {
      "data-tooltip-id": item?.label,
      onMouseOver: () => setMouseOverLabelName(item?.label),
    }),
  };

  useEffect(() => {
    if (item?.to && item?.to === pathname) {
      setActiveMenu(key);
    }
  }, [pathname, searchParams, item?.to, key, setActiveMenu]);

  const handleClick = (event) => {
    if (item?.disabled) {
      event.preventDefault();
      return;
    }

    item?.command?.({ originalEvent: event, item });

    if (item?.items) {
      setActiveMenu(isActive ? parentKey : key);
    } else {
      setActiveMenu(key);
    }
  };

  const renderMenuContent = () => (
    <>
      <i className={classNames("layout-menuitem-icon", item?.icon)} />
      <span className="layout-menuitem-text">{item?.label}</span>
      {item?.items && <i className="pi pi-angle-down layout-submenu-toggler" />}
      <Ripple />
    </>
  );

  const renderSubMenu = () => {
    if (!item?.items || item?.visible === false) return null;

    return (
      <CSSTransition
        nodeRef={nodeRef}
        timeout={{ enter: 1000, exit: 450 }}
        classNames="layout-submenu"
        in={root ? true : isActive}
        key={item?.label}
      >
        <ul ref={nodeRef}>
          {item.items.map((child, i) => (
            <AppMenuItem
              key={child.label}
              item={child}
              index={i}
              className={child.badgeClass}
              parentKey={key}
            />
          ))}
        </ul>
      </CSSTransition>
    );
  };

  if (item?.visible === false) return null;

  return (
    <li
      className={classNames({
        "layout-root-menuitem": root,
        "active-menuitem": isActive,
      })}
    >
      {root && <div className="layout-menuitem-root-text">{item?.label}</div>}

      {(!item?.to || item?.items) && (
        <a
          href={item?.url}
          onClick={handleClick}
          target={item?.target}
          {...commonProps}
        >
          {renderMenuContent()}
        </a>
      )}

      {item?.to && !item?.items && (
        <Link
          href={item?.to}
          replace={item?.replaceUrl}
          target={item?.target}
          onClick={handleClick}
          {...commonProps}
        >
          {renderMenuContent()}
        </Link>
      )}

      {renderSubMenu()}
    </li>
  );
};

// Helper function to determine if tooltip should be shown
const shouldShowTooltip = (layoutState) => {
  return layoutState?.leftSidebarMode === "mini" || layoutState?.mobileActive;
};

export default AppMenuItem;
