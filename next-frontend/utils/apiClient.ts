// utils/apiClient.ts

/**
 * Minimal API client wrapper around `fetch`.
 *
 * Adds:
 *   - Basic error handling
 *   - Rate-limit (429) notification via toast
 *   - JSON parsing w/ fallback
 *
 * NOTE: This helper is intentionally lightweight. For advanced usage
 * (automatic reauth, retry queue, cancellation, abort signals),
 * consider extending this pattern.
 */

import { toast } from "sonner";

interface ApiErrorPayload {
  retry_after?: number | string;
  message?: string;
}

/**
 * Performs a fetch request and returns parsed JSON.
 *
 * @param url - Target HTTP endpoint.
 * @param options - Fetch init options.
 * @throws Error when request is not OK or rate-limited.
 * @returns JSON response body.
 */
export async function apiFetch<T = unknown>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(url, {
    credentials: "include", // default for cookie-based auth
    ...options,
  });

  // Handle rate limit (429)
  if (response.status === 429) {
    let retryAfter: string | number = "some time";

    try {
      const data: ApiErrorPayload = await response.json();
      if (data.retry_after) retryAfter = data.retry_after;
    } catch {
      /* ignore JSON parse failure */
    }

    toast.error(`Rate limit exceeded. Please wait ${retryAfter} seconds.`);
    throw new Error("Rate limit exceeded");
  }

  // Handle other failure cases
  if (!response.ok) {
    let message = "API request failed";

    try {
      const data: ApiErrorPayload = await response.json();
      if (data.message) message = data.message;
    } catch {
      /* ignore JSON failure */
    }

    throw new Error(message);
  }

  // Parse + return JSON (safe)
  try {
    return (await response.json()) as T;
  } catch {
    throw new Error("Failed to parse API response");
  }
}
