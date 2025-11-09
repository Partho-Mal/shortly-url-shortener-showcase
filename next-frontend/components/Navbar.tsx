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
import { Badge } from "./ui/badge"

const Navbar = () => {
  const { setTheme } = useTheme();
  const router = useRouter();
  const { isMobile, setOpenMobile } = useSidebar();

  const [avatarUrl, setAvatarUrl] = useState("");
  const [username, setUsername] = useState("");
  const [avatarError, setAvatarError] = useState(false);
  const [plan, setPlan] = useState<string>("free")

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const data = await apiFetch(
          `${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_USER_DETAILS}`
        );
        setAvatarUrl(data.avatar || "");
        setUsername(data.username || "");
        setPlan(data.plan || "free")
      } catch (err) {
        console.error("Error fetching user details:", err);
      }
    };

    fetchUserDetails();
  }, []);

  const handleLogout = async () => {
    try {
      await apiFetch(`${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_USER_LOGOUT}`, {
        method: "POST",
      });
      localStorage.removeItem("jwt");
      router.push("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };


  const getPlanBadgeStyle = (plan: string) => {
    switch (plan.toLowerCase()) {
      case "free":
        return "bg-gradient-to-br from-red-100 to-red-50 dark:from-red-900/10 dark:to-red-800/10 text-red-600 dark:text-red-300 border border-red-200 dark:border-red-400/30 shadow-inner backdrop-blur-sm transition-all"

      case "pro":
        return "bg-gradient-to-br from-purple-500 via-indigo-600 to-indigo-700 text-white font-semibold ring-1 ring-indigo-300/50 dark:ring-indigo-500/40 shadow-lg backdrop-blur-md hover:scale-[1.02] hover:shadow-indigo-500/20 transition-all duration-200"

      case "enterprise":
        return "bg-gradient-to-tr from-zinc-900 to-black/80 dark:from-white/5 dark:to-yellow-900/10 text-yellow-300 font-semibold border border-white/20 shadow-[inset_0_0_1px_1px_rgba(255,255,255,0.05)] backdrop-blur-md hover:ring-2 hover:ring-yellow-400/40 hover:shadow-yellow-500/10 transition-all duration-200"

      default:
        return "bg-neutral-300 text-black dark:bg-neutral-700 dark:text-white border border-neutral-400 dark:border-neutral-600"
    }
  }




  return (
    <nav className="p-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="hidden md:flex" />

        {isMobile && (
          <button
            onClick={() => setOpenMobile(true)}
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

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")}>System</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar>
              <AvatarImage
                src={!avatarError && avatarUrl ? avatarUrl : undefined}
                alt="User Avatar"
                onError={() => setAvatarError(true)}
              />
              <AvatarFallback>{username ? username.charAt(0).toUpperCase() : "U"}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent sideOffset={10}>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push("/dashboard/plan")}>
              <Stars className="h-[1.2rem] w-[1.2rem] mr-2" />
              Plan
              <Badge className={`ml-2 ${getPlanBadgeStyle(plan)}`}>
                {plan.toUpperCase()}
              </Badge>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/dashboard/support")}>
              <User className="h-[1.2rem] w-[1.2rem] mr-2" />
              Support
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/dashboard/terms-of-service")}>
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


// Scroll To show Sidebar trigger

// "use client";

// import { useEffect, useState } from "react";
// import { FileText, LogOut, Moon, Sun, User } from "lucide-react";
// import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Button } from "./ui/button";
// import { useTheme } from "next-themes";
// import { SidebarTrigger, useSidebar } from "./ui/sidebar";
// import { useRouter } from "next/navigation";
// import { apiFetch } from "@/utils/apiFetch";

// const Navbar = () => {
//   const { setTheme } = useTheme();
//   const router = useRouter();
//   const { isMobile, setOpenMobile } = useSidebar();

//   const [avatarUrl, setAvatarUrl] = useState<string>("");
//   const [username, setUsername] = useState<string>("");
//   const [avatarError, setAvatarError] = useState<boolean>(false);

//   const [showButton, setShowButton] = useState(true);
//   const [lastScrollY, setLastScrollY] = useState(0);

//   useEffect(() => {
//     const fetchUserDetails = async () => {
//       try {
//         const data = await apiFetch(
//           `${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_USER_DETAILS}`
//         );
//         setAvatarUrl(data.avatar || "");
//         setUsername(data.username || "");
//       } catch (err) {
//         console.error("Error fetching user details:", err);
//       }
//     };

//     fetchUserDetails();
//   }, []);

//   useEffect(() => {
//     if (!isMobile) return;

//     const handleScroll = () => {
//       if (window.scrollY > lastScrollY && window.scrollY > 50) {
//         setShowButton(false);
//       } else {
//         setShowButton(true);
//       }
//       setLastScrollY(window.scrollY);
//     };

//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, [isMobile, lastScrollY]);

//   const handleLogout = async () => {
//     try {
//       await apiFetch(`${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_USER_LOGOUT}`, {
//         method: "POST",
//       });
//       localStorage.removeItem("jwt");
//       router.push("/landing");
//     } catch (error) {
//       console.error("Error logging out:", error);
//     }
//   };

//   return (
//     <nav className="p-4 flex items-center justify-between">
//       {/* LEFT */}
//       <div className="flex items-center gap-2">
//         {/* Desktop Sidebar Trigger */}
//         <SidebarTrigger className="md:flex hidden" />

//         {/* Mobile Hamburger Button */}
//         {isMobile && (
//           <button
//             onClick={() => setOpenMobile(true)}
//             className={`fixed top-4 left-4 z-50 p-2 rounded-md bg-background shadow-md text-muted-foreground hover:text-foreground transition md:hidden ${
//               showButton ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full"
//             } duration-300`}
//             aria-label="Open menu"
//           >
//             <svg
//               width="40"
//               height="25"
//               viewBox="0 0 20 20"
//               fill="currentColor"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <path d="M11.6663 12.6686L11.801 12.6823C12.1038 12.7445 12.3313 13.0125 12.3313 13.3337C12.3311 13.6547 12.1038 13.9229 11.801 13.985L11.6663 13.9987H3.33325C2.96609 13.9987 2.66839 13.7008 2.66821 13.3337C2.66821 12.9664 2.96598 12.6686 3.33325 12.6686H11.6663ZM16.6663 6.00163L16.801 6.0153C17.1038 6.07747 17.3313 6.34546 17.3313 6.66667C17.3313 6.98788 17.1038 7.25586 16.801 7.31803L16.6663 7.33171H3.33325C2.96598 7.33171 2.66821 7.03394 2.66821 6.66667C2.66821 6.2994 2.96598 6.00163 3.33325 6.00163H16.6663Z" />
//             </svg>
//           </button>
//         )}
//       </div>

//       {/* RIGHT */}
//       <div className="flex items-center gap-4">
//         {username && (
//           <span className="text-sm font-medium text-muted-foreground hidden md:inline-block">
//             {username}
//           </span>
//         )}

//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <Button variant="outline" size="icon">
//               <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
//               <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
//               <span className="sr-only">Toggle theme</span>
//             </Button>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent align="end">
//             <DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>
//             <DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
//             <DropdownMenuItem onClick={() => setTheme("system")}>System</DropdownMenuItem>
//           </DropdownMenuContent>
//         </DropdownMenu>

//         <DropdownMenu>
//           <DropdownMenuTrigger>
//             <Avatar>
//               <AvatarImage
//                 src={!avatarError && avatarUrl ? avatarUrl : undefined}
//                 alt="User Avatar"
//                 onError={() => setAvatarError(true)}
//               />
//               <AvatarFallback>
//                 {username ? username.charAt(0).toUpperCase() : "U"}
//               </AvatarFallback>
//             </Avatar>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent sideOffset={10}>
//             <DropdownMenuLabel>My Account</DropdownMenuLabel>
//             <DropdownMenuSeparator />
//             <DropdownMenuItem onClick={() => router.push("/dashboard/support")}>
//               <User className="h-[1.2rem] w-[1.2rem] mr-2" />
//               Support
//             </DropdownMenuItem>
//             <DropdownMenuItem onClick={() => router.push("/dashboard/terms-of-service")}>
//               <FileText className="h-[1.2rem] w-[1.2rem] mr-2" />
//               Shortly Terms
//             </DropdownMenuItem>
//             <DropdownMenuSeparator />
//             <DropdownMenuItem onClick={handleLogout} className="text-red-600">
//               <LogOut className="h-[1.2rem] w-[1.2rem] mr-2 text-red-600" />
//               Logout
//             </DropdownMenuItem>
//           </DropdownMenuContent>
//         </DropdownMenu>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;
