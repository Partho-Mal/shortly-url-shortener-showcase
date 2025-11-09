import { useState, useEffect } from "react";
import { Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTitle } from "./ui/drawer";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

export function TooltipOrDrawer({
  icon,
  content,
  label,
}: {
  icon: React.ReactNode;
  content: React.ReactNode;
  label?: string;
}) {
  const [isMobile, setIsMobile] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640); // Tailwind sm breakpoint approx
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (isMobile) {
    // Drawer on mobile
    return (
      <>
        <button
          aria-label={label}
          onClick={() => setOpen(true)}
          className="cursor-pointer"
          type="button"
        >
          {icon}
        </button>
        <Drawer open={open} onOpenChange={setOpen} modal>
          <DrawerContent className="max-w-md p-6">
            <DrawerHeader>
              <DrawerTitle>{label || "Info"}</DrawerTitle>
              <DrawerClose />
            </DrawerHeader>
            <div className="mt-4">{content}</div>
          </DrawerContent>
        </Drawer>
      </>
    );
  }

  // Tooltip on desktop
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{icon}</TooltipTrigger>
        <TooltipContent>{content}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
