"use client";
import React, {
  useContext,
  useEffect,
  useRef,
  createContext,
  useState,
} from "react";
import { LayoutContext } from "./context/layoutcontext";
import { usePathname, useSearchParams } from "next/navigation";
import { classNames } from "@/utils";
import AppTopbar from "./AppTopbar";
import AppSidebar from "./AppSidebar";
import AppFooter from "./AppFooter";
import AppConfig from "./AppConfig";

function Layout({ children }) {
  const [actve, setActive] = useState(false);
  const { layoutConfig, layoutState, setLayoutState } =
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

  console.log("->", layoutState?.configSidebarVisible);

  // const containerClass = classNames("layout-wrapper", {
  //   "toggle-modal": layoutState?.modalActive,
  //   "toggle-config": layoutState?.configSidebarVisible,
  //   "toggle-sidebar": layoutState?.staticMenuDesktopInactive,
  //   "overlay-topbar": layoutConfig.navbarMode === "overlay",
  //   "overlay-layout": layoutConfig.menuMode === "overlay",
  //   "static-sidebar": layoutConfig.menuMode === "static",
  // });

  const notificationText = `You are being redirected to the authorized application. If your browser does not redirect you back, please visit this setup page to continue. You are being redirected to the authorized application. If your browser does not redirect you back, please visit this setup page to continue.`;

  return (
    <div
      // className={`layout-wrapper layout__topbar-fixed3 layout__bottombar-mobile-active ${
      //   actve ? "layout__sidebar-mini-active" : ""
      // }   layout__sidebar-default-active3 `}

      className={`layout-wrapper layout__topbar-hidden3 layout__bottombar-hover-width-and-hight-active  layout__bottombar-hover-width-active3 layout__bottombar-mobile-active layout__topbar-fixed layout__sidebar-overlay3 layout__sidebar-static layout__notification-bar-active3  layout__modal-active3 ${
        actve
          ? "layout__sidebar-mini-hover-to-default-active layout__sidebar-right-mini-hover-to-default-active "
          : ""
      } layout__sidebar-mini-active3 layout__sidebar-default-active3 layout__sidebar-mini-hover-overlay-active3  layout__sidebar-mini-hover-to-default-active3   layout__sidebar-mini-active3 layout__sidebar-static3    layout__sidebar-mini-active3 layout__modal-active3  layout__bottombar-active   `}
    >
      <aside ref={leftSidebarRef} className="layout__sidebar">
        <div className="layout__sidebar-content">
          <AppSidebar />
        </div>
      </aside>

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

            <button
              onClick={() => {
                setActive(!actve);
              }}
            >
              checking button checking button checking button checking button
              checking button checking button checking button
            </button>
          </div>
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
