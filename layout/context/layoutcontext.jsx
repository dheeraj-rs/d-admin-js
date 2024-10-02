"use client";
import React, { useState, createContext } from "react";

export const LayoutContext = createContext({});

export const LayoutProvider = ({ children }) => {
  const [layoutConfig, setLayoutConfig] = useState({
    ripple: false,
    inputStyle: "outlined",
    menuMode: "auto",
    navbarMode: "static",
    colorScheme: "light",
    theme: "lara-light-indigo",
    scale: 14,
  });

  const [layoutState, setLayoutState] = useState({
    staticMenuDesktopInactive: false,
    staticMenuMobileActive: false,
    overlayMenuActive: false,
    profileSidebarVisible: false,
    configSidebarVisible: false,
    menuHoverActive: false,
    modalActive: false,
  });

  // console.log("layoutState :", layoutState);

  const isDesktop = () => {
    return window.innerWidth > 991;
  };

  const isOverlay = () => {
    return layoutConfig.menuMode === "overlay";
  };

  const onMenuToggle = () => {
    if (isDesktop()) {
      setLayoutState((prevLayoutState) => ({
        ...prevLayoutState,
        staticMenuDesktopInactive: !prevLayoutState.staticMenuDesktopInactive,
      }));
    } else {
      setLayoutState((prevLayoutState) => ({
        ...prevLayoutState,
        staticMenuMobileActive: !prevLayoutState.staticMenuMobileActive,
      }));
    }

    if (isOverlay()) {
      setLayoutState((prevLayoutState) => ({
        ...prevLayoutState,
        overlayMenuActive: !prevLayoutState.overlayMenuActive,
      }));
    }
  };

  const showProfileSidebar = () => {
    setLayoutState((prevLayoutState) => ({
      ...prevLayoutState,
      profileSidebarVisible: !prevLayoutState.profileSidebarVisible,
    }));
  };

  const value = {
    layoutConfig,
    setLayoutConfig,
    layoutState,
    setLayoutState,
    onMenuToggle,
    showProfileSidebar,
  };

  return (
    <LayoutContext.Provider value={value}>{children}</LayoutContext.Provider>
  );
};
