"use client";
import React, {
  useState,
  useEffect,
  createContext,
  useCallback,
  useMemo,
} from "react";
import { useIsMobile } from "@/hooks/use-ismobile";

// Create context with default values
export const LayoutContext = createContext({
  layoutConfig: {},
  layoutState: {},
  onMenuToggle: () => {},
  mouseOverLabel: "",
  setMouseOverLabel: () => {},
});

// Constants
const SIDEBAR_MODES = {
  MINI: "mini",
  AUTO: "auto",
};

const INITIAL_LAYOUT_CONFIG = {
  colorScheme: "light",
  theme: "lara-light-indigo",
  scale: 14,
};

// Helper function to create initial state
const createInitialLayoutState = (isMobile) => ({
  isSidebarLeftVisible: !isMobile,
  isSidebarRightVisible: !isMobile,
  isNavbarFixed: true,
  isSidebarFixed: true,
  leftSidebarMode: isMobile ? SIDEBAR_MODES.MINI : SIDEBAR_MODES.AUTO,
  rightSidebarMode: isMobile ? SIDEBAR_MODES.MINI : SIDEBAR_MODES.AUTO,
  bottomBar: {
    isEnabled: true,
    hoverStyle: "both",
    isMobile: isMobile,
  },
  isMobileBottomBarVisible: true,
  isNotificationBarVisible: false,
  isMobileActive: isMobile,
  isModalVisible: false,
  isSearchbarVisible: true,
  searchSidebarItems: [],
  // isTopbarMenuVisible: false,
});

export const LayoutProvider = ({ children }) => {
  const isMobile = useIsMobile();
  const [layoutConfig, setLayoutConfig] = useState(INITIAL_LAYOUT_CONFIG);
  const [layoutState, setLayoutState] = useState(() =>
    createInitialLayoutState(isMobile)
  );
  const [mouseOverLabel, setMouseOverLabel] = useState("");

  // Update font size when scale changes
  useEffect(() => {
    document.documentElement.style.fontSize = `${layoutConfig.scale}px`;
  }, [layoutConfig.scale]);

  // Memoized sidebar toggle handler
  const onMenuToggle = useCallback((sidebarType) => {
    setLayoutState((prev) => ({
      ...prev,
      isSidebarLeftVisible:
        sidebarType === "left"
          ? !prev.isSidebarLeftVisible
          : prev.isSidebarLeftVisible,
      isSidebarRightVisible:
        sidebarType === "right"
          ? !prev.isSidebarRightVisible
          : prev.isSidebarRightVisible,
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
      mouseOverLabel,
      setMouseOverLabel,
    }),
    [layoutConfig, layoutState, onMenuToggle, mouseOverLabel]
  );

  return (
    <LayoutContext.Provider value={contextValue}>
      {children}
    </LayoutContext.Provider>
  );
};

// Custom hook for accessing layout context
export const useLayout = () => {
  const context = React.useContext(LayoutContext);
  if (!context) {
    throw new Error("useLayout must be used within a LayoutProvider");
  }
  return context;
};
