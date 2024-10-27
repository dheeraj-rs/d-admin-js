// Layout.js
"use client";
import React, { useContext, useEffect, useRef, Suspense } from "react";
import { LayoutContext } from "./context/layoutcontext";
import { classNames } from "@/utils";
import AppTopbar from "./AppTopbar";
import AppSidebar from "./AppSidebar";
import AppFooter from "./AppFooter";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import { LayoutSearchbar } from "./utils";
import { useRouter, usePathname } from "next/navigation";

function Layout({ children }) {
  const { layoutState, setLayoutState, mouseOverLabelName } =
    useContext(LayoutContext);
  const router = useRouter();
  const pathname = usePathname();

  const topbarRef = useRef(null);
  const leftSidebarRef = useRef(null);
  const rightSidebarRef = useRef(null);
  const bottomBarRef = useRef(null);
  const searchbarRef = useRef(null);

  // Handle outside clicks for both sidebars
  useEffect(() => {
    function handleClickOutside(event) {
      const shouldHandleOutsideClick =
        window.innerWidth < 991 || !layoutState.sidebarMode;

      const isSearchbarClick = searchbarRef.current?.contains(event.target);

      if (shouldHandleOutsideClick && !isSearchbarClick) {
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

    if (
      (window.innerWidth < 991 || !layoutState.sidebarMode) &&
      (layoutState.toggleSidebarLeft || layoutState.toggleSidebarRight)
    ) {
      document.addEventListener("mousedown", handleClickOutside);
    }

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
  }, [pathname, layoutState.mobileActive, layoutState.sidebarMode]);

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
    "toggle__sidebar-left": toggleSidebarLeft,
    "toggle__sidebar-right": toggleSidebarRight,
    "layout__sidebar-overlay": sidebarMode === false,
    "layout__sidebar-static": sidebarMode === true,
    "layout__sidebar-auto-overlay-active": leftSidebarMode === "auto",
    "layout__sidebar-mini-active": leftSidebarMode === "mini",
    "layout__sidebar-auto-to-default-active":
      leftSidebarMode === "auto-default",
    "layout__sidebar-default-active": leftSidebarMode === "default",
    "layout__sidebar-right-auto-overlay-active": rightSidebarMode === "auto",
    "layout__sidebar-right-mini-active": rightSidebarMode === "mini",
    "layout__sidebar-right-auto-to-default-active":
      rightSidebarMode === "auto-default",
    "layout__sidebar-right-default-active": rightSidebarMode === "default",
    "layout__topbar-fixed": navbarMode === true,
    "layout__topbar-hidden": navbarMode === null,
    "layout__bottombar-active layout__bottombar-mobile-active":
      bottomBar?.enabled,
    "layout__bottombar-hover-width-active":
      bottomBar?.hoverStyle === "width" && bottomBar?.enabled,
    "layout__bottombar-hover-width-and-hight-active":
      bottomBar?.hoverStyle === "both" && bottomBar?.enabled,
    "layout__notification-bar-active": notificationBar === true,
    "layout__modal-active": modalActive,
    "layout__searchbar-active": hoverSearchbar,
    "layout__mobile-active": mobileActive,
  });

  const notificationText = `You are being redirected to the authorized application. If your browser does not redirect you back, please visit this setup page to continue.`;

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

export function AdminLayout({ children }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Layout>{children}</Layout>
    </Suspense>
  );
}
