// components/AppSidebar.tsx

/**
 * Renders the main sidebar for dashboard navigation.
 * Handles both desktop and mobile sidebar states using context.
 */

"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Home,
  LinkIcon,
  QrCodeIcon,
  XIcon,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "./ui/sidebar";
import { Separator } from "./ui/separator";

const items = [
  { title: "Home", url: "/dashboard", icon: Home },
  { title: "Links", url: "/dashboard/links", icon: LinkIcon },
  { title: "QR Codes", url: "/dashboard/makeqr", icon: QrCodeIcon },
];

const AppSidebar = () => {
  const { isMobile, openMobile, setOpenMobile } = useSidebar();

  return (
    <Sidebar key={isMobile ? "mobile" : "desktop"} collapsible="icon">
      {isMobile && openMobile ? (
        <SidebarHeader className="px-4 py-4 border-b">
          <div className="w-full flex items-center justify-between">
            <Link
              href="/dashboard"
              onClick={() => isMobile && setOpenMobile(false)}
              className="flex items-center gap-2 mt-1"
            >
              <Image src="/favicon.svg" width={30} height={30} alt="Logo" />
              <span className="font-semibold">Shortly</span>
            </Link>

            <button
              onClick={() => setOpenMobile(false)}
              className="text-muted-foreground hover:text-foreground transition"
            >
              <XIcon className="w-6 h-6 mt-1" />
              <span className="sr-only">Close</span>
            </button>
          </div>
        </SidebarHeader>
      ) : (
        <SidebarHeader className="py-4">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/dashboard">
                  <Image
                    src="/favicon.svg"
                    width={500}
                    height={500}
                    alt="Logo"
                  />
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
      )}

      <Separator />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Applications</SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link
                      href={item.url}
                      onClick={() => isMobile && setOpenMobile(false)}
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}

              <Separator />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
