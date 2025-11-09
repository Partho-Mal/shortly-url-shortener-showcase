// hooks/use-mobile.ts

/**
 * useIsMobile
 *
 * Returns a boolean indicating whether the viewport width
 * is below the mobile breakpoint.
 *
 * - Uses matchMedia for responsiveness.
 * - Ensures SSR safety.
 */

import { useEffect, useState } from "react";

const MOBILE_BREAKPOINT = 768; // px, Tailwind md breakpoint approx

export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    // Guard against SSR
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia(
      `(max-width: ${MOBILE_BREAKPOINT - 1}px)`
    );

    const handleChange = (): void => {
      setIsMobile(mediaQuery.matches);
    };

    // Initialize
    handleChange();

    // Subscribe to changes
    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  return isMobile;
}
