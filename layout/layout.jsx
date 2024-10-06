"use client";
import React, { useContext, useEffect, useRef, createContext } from "react";
import { LayoutContext } from "./context/layoutcontext";
import { usePathname, useSearchParams } from "next/navigation";
import { classNames } from "@/utils";
import AppTopbar from "./AppTopbar";
import AppSidebar from "./AppSidebar";
import AppFooter from "./AppFooter";
import AppConfig from "./AppConfig";

function Layout({ children }) {
  const { layoutConfig, layoutState, setLayoutState } =
    useContext(LayoutContext);
  const topbarRef = useRef(null);
  const sidebarRef = useRef(null);
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

  console.log("->", layoutState?.configSidebarVisible);

  const containerClass = classNames("layout-wrapper", {
    "toggle-modal": layoutState?.modalActive,
    "toggle-config": layoutState?.configSidebarVisible,
    "toggle-sidebar": layoutState?.staticMenuDesktopInactive,
    "overlay-topbar": layoutConfig.navbarMode === "overlay",
    "overlay-layout": layoutConfig.menuMode === "overlay",
    "static-sidebar": layoutConfig.menuMode === "static",
    // "layout-static-inactive":
    //   layoutState.staticMenuDesktopInactive &&
    //   layoutConfig.menuMode === "static",
    // "layout-overlay-active": layoutState.overlayMenuActive,
    // "layout-mobile-active": layoutState.staticMenuMobileActive,
    // "p-input-filled": layoutConfig.inputStyle === "filled",
    // "p-ripple-disabled": !layoutConfig.ripple,
  });

  return (
    <div className={`layout-wrapper ${containerClass}`}>
      <div ref={sidebarRef} className="layout-sidebar">
        <AppSidebar />
      </div>
      <div className="layout-topbar">
        <AppTopbar ref={topbarRef} />
      </div>
      <div className="layout-main-container">
        <div className="layout-main">{children}</div>
        <AppFooter />
      </div>
      <div className="layout-config">
        <AppConfig />
      </div>
      <div className="layout-modal-container">
        <div className="layout-modal">modal</div>
      </div>
      <div className="layout-mask" />
    </div>
  );
}

export default Layout;
