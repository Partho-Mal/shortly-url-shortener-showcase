"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import ShortLinkForm from "@/components/ShortLinkForm";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function DashboardHome() {
  const router = useRouter();
  const pathname = usePathname();

  const [activeTab, setActiveTab] = useState("short-link");
  const [isAllowed, setIsAllowed] = useState(false);
  const [loading, setLoading] = useState(true);

  const createlink = () => router.push("/dashboard/links/create");
  const createqrcodes = () => router.push("/dashboard/makeqr");
  const viewlinks = () => router.push("/dashboard/links");

  useEffect(() => {
    if (pathname === "/dashboard") setActiveTab("short-link");
  }, [pathname]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/me");
        if (res.ok) {
          const data = await res.json();
          setIsAllowed(data.allowed);
        }
      } catch (err) {
        console.error("Failed to fetch user", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  return (
    <div className="flex flex-col gap-4 px-2 lg:px-6 2xl:px-30">

      {/* howcase Banner */}
      <div className="w-full bg-gradient-to-r from-cyan-500 via-sky-600 to-blue-700 text-white text-center py-3 px-4 rounded-lg shadow-md">
        <p className="text-sm md:text-base font-medium leading-relaxed">
          ⚡ This is a <span className="font-semibold underline underline-offset-2">Showcase / Demo</span> version of the original{" "}
          <span className="font-semibold text-yellow-300">Shortly</span> project.
          <br className="hidden md:block" />
          The full production version with more advanced features is available at{" "}
          <a
            href="https://shortly.streamlab.in"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-yellow-200 hover:text-white underline underline-offset-2 transition-colors"
          >
            shortly.streamlab.in
          </a>.
          <br className="hidden md:block" />
          This lighter version is built specifically for hiring managers to review functionality while protecting proprietary code.
        </p>
      </div>

      <div className="text-3xl font-semibold mb-6 lg:mb-12 col-span-1 lg:col-span-2">
        Build Your Connections
      </div>

      <div className="bg-primary-foreground p-4 rounded-lg col-span-1 lg:col-span-2 flex flex-col lg:flex-row justify-between gap-4">
        <Tabs
          defaultValue="short-link"
          value={activeTab}
          onValueChange={(val) => setActiveTab(val)}
          className="w-full flex flex-col lg:flex-row gap-4"
        >
          <div className="w-full lg:w-2/3">
            <h1 className="text-lg font-medium mb-2 ml-2">Quick Create</h1>

            <TabsContent value="short-link" className="my-4">
              <Card>
                <CardHeader>
                  <CardTitle>Links</CardTitle>
                  <CardDescription>Make short links instantly</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6">
                  <ShortLinkForm key={activeTab} isActive={activeTab === "short-link"} />
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
