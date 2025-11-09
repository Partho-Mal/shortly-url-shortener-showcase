// //next-frontend\app\auth\callback\AuthCallbackClient.tsx
"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AuthCallbackClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    const from = searchParams.get("from"); // 👈 detect where the login started
 
    if (!token) {
      console.warn("DEBUG: No token found in URL. Redirecting to /landing");
      router.push("/landing");
      return;
    }

    // Send token to backend to set cookie
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/set-cookie`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
      .then(async (res) => {
        if (!res.ok) {
          console.warn("DEBUG: Failed to set cookie. Redirecting to /landing");
          router.push("/landing");
          return;
        }

        // Verify cookie auth
        const verifyRes = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/details`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (verifyRes.ok) {
          const user = await verifyRes.json();

         if (from === "billing") {
          router.push("/billing/choose"); // ✅ Go to billing payment step
        } else if (user.plan === "pro") {
          router.push("/dashboard");
        } else {
          router.push("/dashboard");
        }
        } else {
          console.warn("DEBUG: Cookie set, but user not authenticated. Redirecting to /landing");
          router.push("/landing");
        }
      })
      .catch((err) => {
        console.error("DEBUG: Fetch error while setting cookie:", err);
        router.push("/landing");
      });
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-4">
      <div className="flex flex-col items-center p-8 bg-card rounded-lg shadow-lg max-w-sm w-full">
       <div
          className="w-15 hborder-4 border-t-transparent rounded-full animate-spin from-pink-500 via-purple-500 to-indigo-500 border-r-pink-500 border-b-purple-500 border-l-indigo-500 mb-6"
          role="status"
        >
       <div
          className="w-15 h-30 border-4 border-t-transparent rounded-full animate-spin from-pink-500 via-purple-500 to-indigo-500 border-r-pink-500 border-b-purple-500 border-l-indigo-500 mb-6"
          role="status"
        >
          
          <span className="sr-only">Loading...</span>
        </div>
        </div>
        <h2 className="text-2xl font-semibold text-muted-foreground mb-2">
          Logging you in...
        </h2>
        <p className="text-sm text-muted-foreground">
          Please wait while we set up your session.
        </p>
      </div>
    </div>
  );
}
