// utils/apiFetch.ts
import { toast } from "sonner";

export async function apiFetch(url: string, options?: RequestInit) {
  const res = await fetch(url, {
    ...options,
    credentials: "include", // default behavior
  });

  if (res.status === 429) {
    let retryAfter = "some time";
    try {
      const data = await res.json();
      retryAfter = data.retry_after || retryAfter;
    } catch {}
    toast.error(`Rate limit exceeded. Try again after ${retryAfter}.`);
    throw new Error("Rate limit exceeded");
  }

  if (!res.ok) {
    const errorText = await res.text();
    toast.error(`API error: ${res.status} - ${errorText}`);
    throw new Error(`API error ${res.status}`);
  }

  return res.json();
}
