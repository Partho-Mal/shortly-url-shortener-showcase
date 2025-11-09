//next-frontend\components\Header.tsx
'use client';

import { useRouter } from "next/navigation";
import { Moon, Sparkles, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useTheme } from "next-themes";

export default function Header() {
  const router = useRouter();
  const { setTheme } = useTheme();

  const goToLogin = () => router.push("/login");
  const goToSignup = () => router.push("/signup");
  // const goToPricing = () => router.push("/pricing");

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-sm bg-white/70 dark:bg-zinc-900/70 border-b border-slate-200 dark:border-zinc-700">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <div
          onClick={() => router.push("/")}
          className="flex items-center space-x-2 cursor-pointer"
        >
          <Sparkles className="text-primary h-6 w-6" />
          <span className="text-xl font-bold text-slate-800 dark:text-white">
            Shortly
          </span>
        </div>

        {/* Navigation Links */}
        {/* <div className="hidden sm:flex items-center gap-6">
          <button
            onClick={() => router.push("/landing")}
            className="text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-primary cursor-pointer"
          >
            Home
          </button>
          <button
            onClick={goToPricing}
            className="text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-primary cursor-pointer"
          >
            Pricing
          </button>
        </div> */}

        {/* Auth Buttons & Theme Toggle */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={goToLogin}>
            Sign In
          </Button>
          <Button onClick={goToSignup}>
            Sign Up
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme("light")}>
                Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                System
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
