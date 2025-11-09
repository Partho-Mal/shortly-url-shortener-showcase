// components/WarmBackend.tsx
"use client";

import { useEffect } from "react";

/**
 * Sends a one-time backend warm-up request per browser session.
 */
export default function WarmBackend(): null {
  useEffect(() => {
    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!baseUrl) return;

    // Prevent repeat warm-ups within the same tab session.
    if (sessionStorage.getItem("backend-warmed")) return;
    sessionStorage.setItem("backend-warmed", "true");

    fetch(`${baseUrl}/health`, {
      cache: "no-store",
      method: "GET",
    }).catch(() => {});

  }, []);

  return null;
}
