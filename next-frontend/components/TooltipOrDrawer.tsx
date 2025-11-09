// components/TooltipOrDrawer.tsx

/**
 * TooltipOrDrawer
 *
 * Shows a tooltip on desktop and a drawer on mobile screens.
 * Renders the same icon trigger while adapting UX across devices.
 */

"use client";

import { useState, useEffect, type ReactNode } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TooltipOrDrawerProps {
  /** Trigger icon */
  icon: ReactNode;
  /** Body content (tooltip or drawer) */
  content: ReactNode;
  /** Optional title for Drawer */
  label?: string;
}

export function TooltipOrDrawer({
  icon,
  content,
  label = "Info",
}: TooltipOrDrawerProps) {
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  /**
   * Handles device responsiveness
   */
  useEffect(() => {
    const mql = window.matchMedia("(max-width: 639px)"); // tailwind sm breakpoint
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);

    // Initial check
    setIsMobile(mql.matches);

    // Listen for changes
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  /**
   * Mobile → Drawer
   */
  if (isMobile) {
    return (
      <>
        <button
          aria-label={label}
          type="button"
          className="cursor-pointer"
          onClick={() => setOpen(true)}
        >
          {icon}
        </button>

        <Drawer open={open} onOpenChange={setOpen} modal>
          <DrawerContent className="max-w-md p-6">
            <DrawerHeader>
              <DrawerTitle>{label}</DrawerTitle>
              <DrawerClose />
            </DrawerHeader>

            <div className="mt-4">{content}</div>
          </DrawerContent>
        </Drawer>
      </>
    );
  }

  /**
   * Desktop → Tooltip
   */
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {/* Ensure element wrapper since TooltipTrigger requires an element */}
          <span className="cursor-pointer" role="button">
            {icon}
          </span>
        </TooltipTrigger>

        <TooltipContent>{content}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
