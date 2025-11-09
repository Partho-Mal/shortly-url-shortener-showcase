// utils/apiFetch.ts

/**
 * Lightweight API wrapper around `fetch`.
 *
 * Behavior:
 *  - Always includes cookies by default (`credentials: "include"`).
 *  - On HTTP 429 (rate limit), shows a toast with server-provided retry hint (if any) and throws.
 *  - On non-OK responses, surfaces status + raw text in a toast and throws.
 *  - On success, returns `res.json()` (the parsed JSON body).
 *
 * Notes:
 *  - This is intentionally minimal and matches existing call sites.
 *  - Do not change the return shape here; several components expect `res.json()` directly.
 *  - If an endpoint does not return JSON, this will throw at `res.json()`.
 */

import { toast } from "sonner";

export async function apiFetch(url: string, options?: RequestInit) {
  // Include cookies on every request unless explicitly overridden by the caller.
  const res = await fetch(url, {
    ...options,
    credentials: "include",
  });

  // Rate limit handling — expect optional `retry_after` in JSON body.
  if (res.status === 429) {
    let retryAfter = "some time";
    try {
      const data = await res.json();
      // If the backend provides a retry hint, prefer it.
      retryAfter = data.retry_after || retryAfter;
    } catch {
      // If body is not JSON or empty, fall back to the default message.
    }

    toast.error(`Rate limit exceeded. Try again after ${retryAfter}.`);
    throw new Error("Rate limit exceeded");
  }

  // Generic non-OK handling — show status + raw text to aid debugging.
  if (!res.ok) {
    const errorText = await res.text();
    toast.error(`API error: ${res.status} - ${errorText}`);
    throw new Error(`API error ${res.status}`);
  }

  // Success — return parsed JSON. Keep this as-is to match existing usages.
  return res.json();
}
