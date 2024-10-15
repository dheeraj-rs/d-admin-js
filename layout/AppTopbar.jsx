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
    </div>
  );
});

AppTopbar.displayName = "AppTopbar";
export default AppTopbar;
