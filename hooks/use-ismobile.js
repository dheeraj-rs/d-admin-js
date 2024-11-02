import { useEffect, useState } from "react";

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
export { useIsMobile };
