// components/Navbar.tsx

/**
 * Dashboard navigation bar.
 * Shows user details, theme toggle, plan info, and sign-out.
 */

"use client";

import { useEffect, useState } from "react";
import { FileText, LogOut, Moon, Sun, User, Stars } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";
import { useTheme } from "next-themes";
import { SidebarTrigger, useSidebar } from "./ui/sidebar";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/utils/apiFetch";
import { Badge } from "./ui/badge";

const Navbar = () => {
  const { setTheme } = useTheme();
  const router = useRouter();
  const { isMobile, setOpenMobile } = useSidebar();

  const [avatarUrl, setAvatarUrl] = useState("");
  const [username, setUsername] = useState("");
  const [avatarError, setAvatarError] = useState(false);
  const [plan, setPlan] = useState<string>("free");

  useEffect(() => {
    const fetchUserDetails = async (): Promise<void> => {
      try {
        const data = await apiFetch(
          `${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_USER_DETAILS}`
        );
        setAvatarUrl(data.avatar || "");
        setUsername(data.username || "");
        setPlan(data.plan || "free");
      } catch {
        // Request failed; defaults are used
      }
    };

    fetchUserDetails();
  }, []);

  const handleLogout = async (): Promise<void> => {
    try {
      // ❌ Temporarily skip backend logout
      // await apiFetch(`${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_USER_LOGOUT}`, {
      //   method: "POST",
      // });

      // ✅ Delete cookie client-side
      document.cookie = "token=; path=/; max-age=0;";

      // ✅ Delete fallback JWT
      localStorage.removeItem("jwt");

      router.push("/");
    } catch {
      document.cookie = "token=; path=/; max-age=0;";
      localStorage.removeItem("jwt");
      router.push("/");
    }
  };

  const getPlanBadgeStyle = (p: string): string => {
    switch (p.toLowerCase()) {
      case "free":
        return "bg-gradient-to-br from-red-100 to-red-50 dark:from-red-900/10 dark:to-red-800/10 text-red-600 dark:text-red-300 border border-red-200 dark:border-red-400/30 shadow-inner backdrop-blur-sm";
      case "pro":
        return "bg-gradient-to-br from-purple-500 via-indigo-600 to-indigo-700 text-white font-semibold ring-1 ring-indigo-300/50 dark:ring-indigo-500/40 shadow-lg backdrop-blur-md";
      case "enterprise":
        return "bg-gradient-to-tr from-zinc-900 to-black/80 dark:from-white/5 dark:to-yellow-900/10 text-yellow-300 font-semibold border border-white/20 shadow-[inset_0_0_1px_1px_rgba(255,255,255,0.05)] backdrop-blur-md";
      default:
        return "bg-neutral-300 text-black dark:bg-neutral-700 dark:text-white border border-neutral-400 dark:border-neutral-600";
    }
  };

  return (
    <nav className="p-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="hidden md:flex" />

        {isMobile && (
          <button
            onClick={(): void => setOpenMobile(true)}
            className="top-4 left-4 z-50 py-2 ml-1 rounded-md bg-background shadow-md text-muted-foreground hover:text-foreground transition md:hidden"
            aria-label="Open menu"
          >
            <svg
              width="40"
              height="30"
              viewBox="0 0 20 20"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M11.6663 12.6686L11.801 12.6823C12.1038 12.7445 12.3313 13.0125 12.3313 13.3337C12.3311 13.6547 12.1038 13.9229 11.801 13.985L11.6663 13.9987H3.33325C2.96609 13.9987 2.66839 13.7008 2.66821 13.3337C2.66821 12.9664 2.96598 12.6686 3.33325 12.6686H11.6663ZM16.6663 6.00163L16.801 6.0153C17.1038 6.07747 17.3313 6.34546 17.3313 6.66667C17.3313 6.98788 17.1038 7.25586 16.801 7.31803L16.6663 7.33171H3.33325C2.96598 7.33171 2.66821 7.03394 2.66821 6.66667C2.66821 6.2994 2.96598 6.00163 3.33325 6.00163H16.6663Z" />
            </svg>
          </button>
        )}
      </div>

      <div className="flex items-center gap-4">
        {username && (
          <span className="text-sm font-medium text-muted-foreground hidden md:inline-block">
            {username}
          </span>
        )}

        {/* Theme toggle */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={(): void => setTheme("light")}>
              Light
            </DropdownMenuItem>
            <DropdownMenuItem onClick={(): void => setTheme("dark")}>
              Dark
            </DropdownMenuItem>
            <DropdownMenuItem onClick={(): void => setTheme("system")}>
              System
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Account menu */}
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar>
              <AvatarImage
                src={!avatarError && avatarUrl ? avatarUrl : undefined}
                alt="User Avatar"
                onError={(): void => setAvatarError(true)}
              />
              <AvatarFallback>
                {username ? username.charAt(0).toUpperCase() : "U"}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>

          <DropdownMenuContent sideOffset={10}>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={(): void => router.push("/dashboard/plan")}
            >
              <Stars className="h-[1.2rem] w-[1.2rem] mr-2" />
              Plan
              <Badge className={`ml-2 ${getPlanBadgeStyle(plan)}`}>
                {plan.toUpperCase()}
              </Badge>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={(): void => router.push("/dashboard/support")}
            >
              <User className="h-[1.2rem] w-[1.2rem] mr-2" />
              Support
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={(): void => router.push("/dashboard/terms-of-service")}
            >
              <FileText className="h-[1.2rem] w-[1.2rem] mr-2" />
              Shortly Terms
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={handleLogout} className="text-red-600">
              <LogOut className="h-[1.2rem] w-[1.2rem] mr-2 text-red-600" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};

export default Navbar;
