// utils/apiClient.ts
import { toast } from "sonner";

export async function apiFetch(url: string, options?: RequestInit) {
  const res = await fetch(url, options);

  if (res.status === 429) {
    let retryAfter = "some time";
    try {
      const data = await res.json();
      retryAfter = data.retry_after || retryAfter;
    } catch {}
    toast.error(`Rate limit exceeded. Please wait ${retryAfter} seconds.`);
    throw new Error("Rate limit exceeded");
  }

  if (!res.ok) {
    throw new Error("API request failed");
  }

  return res.json();
}
