"use client";
import React, {
  useState,
  createContext,
  useEffect,
  useCallback,
  useMemo,
} from "react";

export const LayoutContext = createContext({});

const initialLayoutConfig = {
  ripple: false,
  inputStyle: "outlined",
  colorScheme: "light",
  theme: "lara-light-indigo",
  scale: 14,
};

const initialLayoutState = (isMobile) => ({
  toggleSidebarLeft: isMobile ? false : true,
  toggleSidebarRight: isMobile ? false : true,
  navbarMode: true,
  sidebarMode: true,
  leftSidebarMode: isMobile ? "mini" : "auto",
  rightSidebarMode: isMobile ? "mini" : "auto",
  bottomBar: {
    enabled: true,
    hoverStyle: "both",
  },
  mobileActive: isMobile,
  notificationBar: false,
  modalActive: false,
  searchSidebarItems: [],
  showTopbarMenu: false,
});

// Optimized mobile detection hook with SSR support
const useIsMobile = (breakpoint = 991) => {
  // Initialize with null or false for SSR
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Update the state with the actual window width on client-side
    const checkMobile = () => setIsMobile(window.innerWidth < breakpoint);

    // Initial check
    checkMobile();

    let timeoutId;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(checkMobile, 150); // Debounce resize events
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timeoutId);
    };
  }, [breakpoint]);

  return isMobile;
};

export const LayoutProvider = ({ children }) => {
  const isMobile = useIsMobile();
  const [layoutConfig, setLayoutConfig] = useState(initialLayoutConfig);
  const [layoutState, setLayoutState] = useState(() =>
    initialLayoutState(isMobile)
  );
  const [mouseOverLabelName, setMouseOverLabelName] = useState("");

  // Update layout state when mobile status changes
  useEffect(() => {
    setLayoutState((prev) => ({
      ...prev,
      leftSidebarMode: isMobile ? "mini" : "auto",
      rightSidebarMode: isMobile ? "mini" : "auto",
      mobileActive: isMobile,
    }));
  }, [isMobile]);

  // Handle font size updates
  useEffect(() => {
    document.documentElement.style.fontSize = `${layoutConfig.scale}px`;
  }, [layoutConfig.scale]);

  // Memoized menu toggle handler
  const onMenuToggle = useCallback((type) => {
    setLayoutState((prev) => ({
      ...prev,
      toggleSidebarLeft:
        type === "left" ? !prev.toggleSidebarLeft : prev.toggleSidebarLeft,
      toggleSidebarRight:
        type === "right" ? !prev.toggleSidebarRight : prev.toggleSidebarRight,
    }));
  }, []);

  // Memoized topbar menu handler
  const showTopbarMenuDropdown = useCallback(() => {
    setLayoutState((prev) => ({
      ...prev,
      showTopbarMenu: !prev.showTopbarMenu,
    }));
  }, []);

  // Memoized context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      layoutConfig,
      setLayoutConfig,
      layoutState,
      setLayoutState,
      onMenuToggle,
      mouseOverLabelName,
      setMouseOverLabelName,
      showTopbarMenuDropdown,
    }),
    [
      layoutConfig,
      layoutState,
      onMenuToggle,
      mouseOverLabelName,
      showTopbarMenuDropdown,
    ]
  );

  return (
    <LayoutContext.Provider value={contextValue}>
      {children}
    </LayoutContext.Provider>
  );
};

export const useLayout = () => React.useContext(LayoutContext);
