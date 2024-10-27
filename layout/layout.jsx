"use client";
import React, { useContext, useEffect, useRef, useState } from "react";
import { LayoutContext } from "./context/layoutcontext";
import { usePathname, useSearchParams } from "next/navigation";
import { classNames } from "@/utils";
import AppTopbar from "./AppTopbar";
import AppSidebar from "./AppSidebar";
import AppFooter from "./AppFooter";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import { LayoutSearchbar } from "./utils";

function Layout({ children }) {
  const { layoutState, setLayoutState, mouseOverLabelName } =
    useContext(LayoutContext);

  const topbarRef = useRef(null);
  const leftSidebarRef = useRef(null);
  const rightSidebarRef = useRef(null);
  const bottomBarRef = useRef(null);
  const searchbarRef = useRef(null);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Handle outside clicks for both sidebars
  useEffect(() => {
    function handleClickOutside(event) {
      // Check if in mobile mode or overlay type
      const shouldHandleOutsideClick =
        window.innerWidth < 991 || !layoutState.sidebarMode;

      // Check if the click is on the searchbar or its children
      const isSearchbarClick = searchbarRef.current?.contains(event.target);

      if (shouldHandleOutsideClick && !isSearchbarClick) {
        // Check if click is outside left sidebar
        if (
          leftSidebarRef.current &&
          !leftSidebarRef.current.contains(event.target) &&
          layoutState.toggleSidebarLeft
        ) {
          setLayoutState((prev) => ({
            ...prev,
            toggleSidebarLeft: false,
          }));
        }

        // Check if click is outside right sidebar
        if (
          rightSidebarRef.current &&
          !rightSidebarRef.current.contains(event.target) &&
          layoutState.toggleSidebarRight
        ) {
          setLayoutState((prev) => ({
            ...prev,
            toggleSidebarRight: false,
          }));
        }
      }
    }

    // Add event listener if either sidebar is open and (in mobile mode or overlay type)
    if (
      (window.innerWidth < 991 || !layoutState.sidebarMode) &&
      (layoutState.toggleSidebarLeft || layoutState.toggleSidebarRight)
    ) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    // Cleanup function
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [
    layoutState.toggleSidebarLeft,
    layoutState.toggleSidebarRight,
    layoutState.sidebarMode,
    layoutState.mobileActive,
    setLayoutState,
  ]);

  const hideMenu = () => {
    // Hide menu if in mobile mode or overlay type
    if (window.innerWidth < 991 || !layoutState.sidebarMode) {
      setLayoutState((prevLayoutState) => ({
        ...prevLayoutState,
        toggleSidebarLeft: false,
        toggleSidebarRight: false,
        menuHoverActive: false,
      }));
      unblockBodyScroll();
    }
  };

  const hideProfileMenu = () => {
    setLayoutState((prevLayoutState) => ({
      ...prevLayoutState,
      profileSidebarVisible: false,
    }));
  };

  const blockBodyScroll = () => {
    document.body.classList.add("blocked-scroll");
  };

  const unblockBodyScroll = () => {
    document.body.classList.remove("blocked-scroll");
  };

  // Handle route changes
  useEffect(() => {
    if (layoutState.mobileActive || !layoutState.sidebarMode) {
      hideMenu();
    }
    hideProfileMenu();
  }, [pathname, searchParams]);

  // Handle body scroll
  useEffect(() => {
    if (
      layoutState.mobileActive?.toggleSidebarRight ||
      layoutState.mobileActive?.toggleSidebarLeft
    ) {
      blockBodyScroll();
    }

    return () => {
      unblockBodyScroll();
    };
  }, [
    layoutState.mobileActive?.toggleSidebarRight,
    layoutState.mobileActive?.toggleSidebarLeft,
  ]);

  const {
    toggleSidebarLeft,
    toggleSidebarRight,
    navbarMode,
    sidebarMode,
    leftSidebarMode,
    rightSidebarMode,
    bottomBar,
    notificationBar,
    modalActive,
    hoverSearchbar,
    mobileActive,
  } = layoutState || {};

  const containerClass = classNames("layout-wrapper", {
    // Sidebar states
    "toggle__sidebar-left": toggleSidebarLeft,
    "toggle__sidebar-right": toggleSidebarRight,
    "layout__sidebar-overlay": sidebarMode === false,
    "layout__sidebar-static": sidebarMode === true,

    // Left Sidebar modes
    "layout__sidebar-auto-overlay-active": leftSidebarMode === "auto",
    "layout__sidebar-mini-active": leftSidebarMode === "mini",
    "layout__sidebar-auto-to-default-active":
      leftSidebarMode === "auto-default",
    "layout__sidebar-default-active": leftSidebarMode === "default",

    // Right Sidebar modes
    "layout__sidebar-right-auto-overlay-active": rightSidebarMode === "auto",
    "layout__sidebar-right-mini-active": rightSidebarMode === "mini",
    "layout__sidebar-right-auto-to-default-active":
      rightSidebarMode === "auto-default",
    "layout__sidebar-right-default-active": rightSidebarMode === "default",

    // Navbar modes
    "layout__topbar-fixed": navbarMode === true,
    "layout__topbar-hidden": navbarMode === null,

    // Bottom bar states
    "layout__bottombar-active layout__bottombar-mobile-active":
      bottomBar?.enabled,
    "layout__bottombar-hover-width-active":
      bottomBar?.hoverStyle === "width" && bottomBar?.enabled,
    "layout__bottombar-hover-width-and-hight-active":
      bottomBar?.hoverStyle === "both" && bottomBar?.enabled,

    // Additional layout states
    "layout__notification-bar-active": notificationBar === true,
    "layout__modal-active": modalActive,
    "layout__searchbar-active": hoverSearchbar,
    "layout__mobile-active": mobileActive,
  });

  const notificationText = `You are being redirected to the authorized application. If your browser does not redirect you back, please visit this setup page to continue. You are being redirected to the authorized application. If your browser does not redirect you back, please visit this setup page to continue.`;

  return (
    <div className={`${containerClass} toggle__bottombar-right`}>
      <aside ref={leftSidebarRef} className="layout__sidebar">
        <div className="layout__sidebar-content">
          <AppSidebar />
        </div>
      </aside>

      <LayoutSearchbar searchbarRef={searchbarRef} />

      <Tooltip
        id={mouseOverLabelName}
        content={mouseOverLabelName}
        place="right"
        style={{ marginLeft: "1rem", zIndex: 9999 }}
      />

      <aside ref={rightSidebarRef} className="layout__sidebar-right">
        <div className="layout__sidebar-right-content"></div>
      </aside>

      <main className="layout__main">
        <header className="layout__topbar">
          <div className="layout__notification-bar">
            <div className="layout__notification-content">
              {notificationText}
            </div>
          </div>
          <nav ref={topbarRef} className="layout__nav">
            <AppTopbar />
          </nav>
        </header>

        <div className="layout__content">
          <div className="layout__content-inner">
            {children}

            <AppFooter />
          </div>
        </div>

        <div ref={bottomBarRef} className="layout__bottombar">
          <div className="layout__bottombar-content"></div>
          <div className="layout__bottombar-mobile-content"></div>
        </div>
      </main>

      <div className="layout__modal"></div>
      <div className="layout__overlay" />
    </div>
  );
}

export default Layout;
