"use client";
import React, { useState, createContext, useEffect } from "react";

export const LayoutContext = createContext({});

export const LayoutProvider = ({ children }) => {
  const [layoutConfig, setLayoutConfig] = useState({
    ripple: false,
    inputStyle: "outlined",
    colorScheme: "light",
    theme: "lara-light-indigo",
    scale: 14,
    toggleSidebarLeft: true,
    toggleSidebarRight: true,
  });

  const [layoutState, setLayoutState] = useState({
    navbarMode: true,
    sidebarMode: true,
    leftSidebarMode: "auto",
    rightSidebarMode: "auto",
    bottomBar: {
      enabled: true,
      hoverStyle: "both",
    },
    notificationBar: false,
    modalActive: false,
    searchSidebarItems: [],
  });

  useEffect(() => {
    document.documentElement.style.fontSize = layoutConfig.scale + "px";
  }, [layoutConfig.scale]);

  const onMenuToggle = (type) => {
    setLayoutState((prevLayoutState) => {
      const newState = {
        ...prevLayoutState,
        ...(type === "left" && {
          toggleSidebarLeft: !prevLayoutState.toggleSidebarLeft,
        }),
        ...(type === "right" && {
          toggleSidebarRight: !prevLayoutState.toggleSidebarRight,
        }),
      };
      if (
        newState.toggleSidebarLeft !== prevLayoutState.toggleSidebarLeft ||
        newState.toggleSidebarRight !== prevLayoutState.toggleSidebarRight
      ) {
        return newState;
      }
      return prevLayoutState;
    });
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
