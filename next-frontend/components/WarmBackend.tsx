// components/WarmBackend.tsx

/**
 * @fileoverview
 * WarmBackend component.
 *
 * On initial mount, issues a lightweight GET request to `/health`
 * on the backend. This reduces cold-start latency on providers where
 * the API may sleep after inactivity (e.g., serverless/edge execution).
 *
 * The request is intentionally fire-and-forget — the response is not used,
 * and UI is not blocked. If it fails, we silently ignore the error.
 */

"use client";

import { useEffect } from "react";

/**
 * Sends a backend warm-up request. Renders nothing.
 * Should be mounted near root (e.g., `app/layout.tsx`) so the ping
 * triggers early once the user visits the app.
 */
export default function WarmBackend(): null {
  useEffect(() => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;

    // If backend URL is missing, exit early.
    if (!baseUrl) return;

    // Fire-and-forget GET → /health
    void fetch(`${baseUrl}/health`, {
      method: "GET",
      cache: "no-store",
    }).catch(() => {
      // Ignore failures — warm-up is best-effort only.
    });
  }, []);

  return null;
}
