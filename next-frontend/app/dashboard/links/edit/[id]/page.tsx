// next-frontend/app/dashboard/links/edit/[id]/page.tsx

/**
 * Page for editing an existing short link.
 * Loads current link details, allows updating slug and/or URL,
 * validates input, and sends update request to backend.
 */

"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export default function EditShortLinkPage() {
  const router = useRouter();
  const { id: slug } = useParams();

  const [uuid, setUUID] = useState("");
  const [placeholderSlug, setPlaceholderSlug] = useState("");
  const [placeholderURL, setPlaceholderURL] = useState("");
  const [newSlug, setNewSlug] = useState("");
  const [newURL, setNewURL] = useState("");
  const [loading, setLoading] = useState(false);

  // Validate slug format
  const isValidSlug = (value: string): boolean =>
    /^[a-zA-Z0-9_-]{3,}$/.test(value);

  useEffect(() => {
    const fetchLinkDetails = async (): Promise<void> => {
      try {
        const res = await fetch(`${API_URL}/dashboard/links/${slug}`, {
          credentials: "include",
        });

        const data = await res.json();

        if (!res.ok) {
          toast.error(data.error || "Failed to fetch link details.");
          return;
        }

        setPlaceholderSlug(data.slug ?? "");
        setPlaceholderURL(data.original_url ?? "");
        setUUID(data.id ?? "");
      } catch {
        toast.error("Error loading link.");
      }
    };

    fetchLinkDetails();
  }, [slug]);

  const handleUpdate = async (): Promise<void> => {
    const payload: Record<string, string> = {
      id: uuid,
      custom_domain: "",
    };

    const trimmedSlug = newSlug.trim();
    const trimmedURL = newURL.trim();

    // Validate and append slug if provided
    if (trimmedSlug) {
      if (!isValidSlug(trimmedSlug)) {
        toast.error(
          "Back-half must be at least 3 characters and contain only letters, numbers, hyphens, or underscores."
        );
        return;
      }
      payload.new_slug = trimmedSlug;
    }

    // Append URL if provided
    if (trimmedURL) {
      payload.new_url = trimmedURL;
    }

    // Require at least one field
    if (!payload.new_slug && !payload.new_url) {
      toast.error("Please provide at least one field to update.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/dashboard/links/edit`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Shortlink updated successfully.");
        router.push("/dashboard/links");
        return;
      }

      toast.error(data.error || "Update failed.");
    } catch {
      toast.error("Something went wrong while updating.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-6 max-w-xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Edit Short Link</h1>

      <div>
        <Label htmlFor="slug">New back-half</Label>
        <Input
          id="slug"
          placeholder={placeholderSlug}
          value={newSlug}
          onChange={(e) => setNewSlug(e.target.value)}
          className="mt-2"
        />
      </div>

      <div>
        <Label htmlFor="url">New Destination URL</Label>
        <Input
          id="url"
          placeholder={placeholderURL}
          value={newURL}
          onChange={(e) => setNewURL(e.target.value)}
          className="mt-2"
        />
      </div>

      <div className="flex gap-4">
        <Button
          variant="outline"
          type="button"
          onClick={() => router.back()}
          disabled={loading}
        >
          Cancel
        </Button>

        <Button onClick={handleUpdate} disabled={loading}>
          {loading ? "Updating..." : "Update Link"}
        </Button>
      </div>
    </main>
  );
}
