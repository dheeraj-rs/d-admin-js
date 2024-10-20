"use client";
import React, { useContext, useEffect, useRef } from "react";
import { LayoutContext } from "./context/layoutcontext";
import { usePathname, useSearchParams } from "next/navigation";
import { classNames } from "@/utils";
import AppTopbar from "./AppTopbar";
import AppSidebar from "./AppSidebar";
import AppFooter from "./AppFooter";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

function Layout({ children }) {
  const { layoutState, setLayoutState, mouseOverLabelName } =
    useContext(LayoutContext);

  const topbarRef = useRef(null);
  const leftSidebarRef = useRef(null);
  const rightSidebarRef = useRef(null);
  const bottomBarRef = useRef(null);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const useEventListener = ({ type, listener }) => {
    const listenerRef = useRef(listener);

    useEffect(() => {
      listenerRef.current = listener;
    }, [listener]);

    const bindEventListener = () => {
      window.addEventListener(type, listenerRef.current);
    };

    const unbindEventListener = () => {
      window.removeEventListener(type, listenerRef.current);
    };

    useEffect(() => {
      return () => {
        unbindEventListener();
      };
    }, []);

    return [bindEventListener, unbindEventListener];
  };

  const [bindMenuOutsideClickListener, unbindMenuOutsideClickListener] =
    useEventListener({
      type: "click",
      listener: (event) => {
        const isOutsideClicked = !(
          sidebarRef.current?.isSameNode(event.target) ||
          sidebarRef.current?.contains(event.target) ||
          topbarRef.current?.menubutton?.isSameNode(event.target) ||
          topbarRef.current?.menubutton?.contains(event.target)
        );

        if (isOutsideClicked) {
          hideMenu();
        }
      },
    });

  const [
    bindProfileMenuOutsideClickListener,
    unbindProfileMenuOutsideClickListener,
  ] = useEventListener({
    type: "click",
    listener: (event) => {
      const isOutsideClicked = !(
        topbarRef.current?.topbarmenu?.isSameNode(event.target) ||
        topbarRef.current?.topbarmenu?.contains(event.target) ||
        topbarRef.current?.topbarmenubutton?.isSameNode(event.target) ||
        topbarRef.current?.topbarmenubutton?.contains(event.target)
      );

      if (isOutsideClicked) {
        hideProfileMenu();
      }
    },
  });

  useEffect(() => {
    hideMenu();
    hideProfileMenu();
  }, [pathname, searchParams]);

  const hideMenu = () => {
    setLayoutState((prevLayoutState) => ({
      ...prevLayoutState,
      overlayMenuActive: false,
      staticMenuMobileActive: false,
      menuHoverActive: false,
    }));
    unbindMenuOutsideClickListener();
    unblockBodyScroll();
  };

  const hideProfileMenu = () => {
    setLayoutState((prevLayoutState) => ({
      ...prevLayoutState,
      profileSidebarVisible: false,
    }));
    unbindProfileMenuOutsideClickListener();
  };

  const blockBodyScroll = () => {
    document.body.classList.add("blocked-scroll");
  };

  const unblockBodyScroll = () => {
    document.body.classList.remove("blocked-scroll");
  };

  useEffect(() => {
    if (layoutState.overlayMenuActive || layoutState.staticMenuMobileActive) {
      bindMenuOutsideClickListener();
    }

    if (layoutState.staticMenuMobileActive) {
      blockBodyScroll();
    }

    return () => {
      unbindMenuOutsideClickListener();
      unblockBodyScroll();
    };
  }, [layoutState.overlayMenuActive, layoutState.staticMenuMobileActive]);

  useEffect(() => {
    if (layoutState.profileSidebarVisible) {
      bindProfileMenuOutsideClickListener();
    }

    return () => {
      unbindProfileMenuOutsideClickListener();
    };
  }, [layoutState.profileSidebarVisible]);

  const containerClass = classNames("layout-wrapper", {
    // "toggle-modal": layoutState?.modalActive,
    // "toggle-config": layoutState?.configSidebarVisible,
    // "toggle-sidebar": layoutState?.staticMenuDesktopInactive,
    // "overlay-topbar": layoutConfig.navbarMode === "overlay",
    // "overlay-layout": layoutConfig.menuMode === "overlay",
    // "static-sidebar": layoutConfig.menuMode === "static",

    "layout__topbar-fixed": layoutState?.navbarType === "fixed",
    "layout__topbar-hidden": layoutState?.navbarType === "hidden",
    "layout__sidebar-overlay": layoutState?.sidebarType === "overlay",
    "layout__sidebar-static": layoutState?.sidebarType === "fixed",
    "layout__sidebar-mini-hover-overlay-active":
      layoutState?.leftSidebarMode === "mini-hover",
    "layout__sidebar-mini-active": layoutState?.leftSidebarMode === "mini",
    "layout__sidebar-mini-hover-to-default-active":
      layoutState?.leftSidebarMode === "mini-hover-default",
    "layout__sidebar-default-active":
      layoutState?.leftSidebarMode === "default",
    "layout__sidebar-right-mini-hover-overlay-active":
      layoutState?.rightSidebarMode === "mini-hover",
    "layout__sidebar-right-mini-active":
      layoutState?.rightSidebarMode === "mini",
    "layout__sidebar-right-mini-hover-to-default-active":
      layoutState?.rightSidebarMode === "mini-hover-default",
    "layout__sidebar-right-default-active":
      layoutState?.rightSidebarMode === "default",
    "layout__sidebar-mobile-mini-active":
      layoutState?.mobileLeftSidebarMode === "m-mini",
    "layout__sidebar-mobile-default-active":
      layoutState?.mobileLeftSidebarMode === "m-default",
    "layout__sidebar-mobile-mini-active":
      layoutState?.mobileRightSidebarMode === "m-mini",
    "layout__sidebar-mobile-default-active":
      layoutState?.mobileRightSidebarMode === "m-default",
    "layout__bottombar-mobile-active": layoutState?.mobileBottomBar,
    "layout__bottombar-active": layoutState?.bottomBar.enabled,
    "layout__bottombar-hover-width-active":
      layoutState?.bottomBar.hoverStyle === "width" &&
      layoutState?.bottomBar.enabled,
    "layout__bottombar-hover-width-and-hight-active":
      layoutState?.bottomBar.hoverStyle === "both" &&
      layoutState?.bottomBar.enabled,
    "layout__notification-bar-active": layoutState?.notificationBar,
    "layout__modal-active": layoutState?.activeModal,
  });

  const notificationText = `You are being redirected to the authorized application. If your browser does not redirect you back, please visit this setup page to continue. You are being redirected to the authorized application. If your browser does not redirect you back, please visit this setup page to continue.`;

  return (
    <div className={`layout-wrapper ${containerClass}`}>
      <aside ref={leftSidebarRef} className="layout__sidebar">
        <div className="layout__sidebar-content">
          <AppSidebar />
        </div>
      </aside>
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
          <div className="layout__content-inner">{children}</div>
          <AppFooter />
        </div>

        <div ref={bottomBarRef} className="layout__bottombar">
          <div className="layout__bottombar-content">bottombar</div>
          <div className="layout__bottombar-mobile-content">bottombar2</div>
        </div>
      </main>

      <div className="layout__modal"></div>
      <div className="layout__overlay" />
    </div>
  );
}

export default Layout;
