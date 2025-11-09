// next-frontend/app/auth/callback/AuthCallbackClient.tsx

/**
 * Handles authentication callback after external login.
 * Reads token and origin from URL, forwards token to backend to set cookie,
 * verifies authentication, and redirects user based on context.
 */

"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AuthCallbackClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    const from = searchParams.get("from");

    // Redirect if token is not present
    if (!token) {
      router.push("/");
      return;
    }

    // Forward token to backend to create auth cookie
    fetch("/api/auth/set-cookie", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
      .then(async (res) => {
        if (!res.ok) {
          router.push("/");
          return;
        }

        // Validate authentication via backend user endpoint
        const verifyRes = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/details`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (!verifyRes.ok) {
          router.push("/dashboard");
          return;
        }

        const user = await verifyRes.json();

        // Redirect if login originated from billing
        if (from === "billing") {
          router.push("/billing/choose");
          return;
        }

        // Redirect user based on plan
        if (user.plan === "pro") {
          router.push("/dashboard");
        } else {
          router.push("/dashboard");
        }
      })
      .catch(() => {
        router.push("/landing");
      });
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-4">
      <div className="flex flex-col items-center p-8 bg-card rounded-lg shadow-lg max-w-sm w-full">
        <div
          className="w-15 h-30 border-4 border-t-transparent rounded-full animate-spin border-r-pink-500 border-b-purple-500 border-l-indigo-500 mb-6"
          role="status"
        >
          <span className="sr-only">Loading...</span>
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
