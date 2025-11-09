// app/dashboard/layout.tsx
import { ReactNode } from 'react';

import Navbar from '@/components/Navbar';

import  AppSidebar  from '@/components/AppSidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { cookies } from 'next/headers';
import { Toaster } from "sonner";

export const metadata = {
  robots: 'noindex, nofollow', // 👈 Tells bots not to index this route
};

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const cookieStore =  await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  return (
    <div className="flex min-h-screen bg-background text-foreground">  
        {/* Sidebar */}
        <SidebarProvider defaultOpen={defaultOpen}>

            <AppSidebar/>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col">
                <Navbar />
                <Toaster 
                    position="top-right" 
                    richColors 
                    closeButton
                />
                <main className="flex-1 p-4 overflow-y-auto">{children}</main>
            </div>
        </SidebarProvider>
     
    </div>
  );
}
