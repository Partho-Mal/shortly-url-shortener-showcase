// components/ShortLinkForm.tsx

/**
 * ShortLinkForm
 *
 * A lightweight form for creating short URLs.
 * Requires authenticated API; used inside dashboard tabs.
 *
 * Behaviors:
 *  - Autofocuses when active (tab in view)
 *  - Calls backend to generate a short link
 *  - Displays share actions + copy action
 */

"use client";

import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  FacebookIcon,
  InstagramIcon,
  MailIcon,
  MessageCircleIcon,
  Share2Icon,
  TwitterIcon,
  YoutubeIcon,
  CopyIcon,
  SendIcon,
} from "lucide-react";
import { Label } from "@/components/ui/label";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;
const BACKEND_DOMAIN = process.env.NEXT_PUBLIC_BACKEND_URL!;

interface ShortLinkFormProps {
  /** Whether this tab is currently active, used to manage autofocus */
  isActive: boolean;
}

export default function ShortLinkForm({ isActive }: ShortLinkFormProps) {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  /**
   * Focus input when visible. Avoids timing issues by deferring via timeout.
   */
  useEffect(() => {
    if (!isActive) return;
    const timer = setTimeout(() => inputRef.current?.focus(), 100);
    return () => clearTimeout(timer);
  }, [isActive]);

  /**
   * Handles short-link generation via API.
   */
  const handleCreate = async (): Promise<void> => {
    if (!url) return;

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/shorten`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ original_url: url }),
      });

      const data = await res.json();

      if (res.ok && data.slug) {
        setShortUrl(data.short_url ?? `${BACKEND_DOMAIN}/${data.slug}`);
        setOpenDialog(true);
      } else {
        alert(data.error || "Unable to create short link.");
      }
    } catch {
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Copies the generated URL to clipboard.
   */
  const handleCopy = (): void => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1500);
  };

  /**
   * Social sharing surface actions.
   */
  const shareTargets = [
    {
      label: "WhatsApp",
      url: `https://wa.me/?text=${encodeURIComponent(shortUrl)}`,
      icon: <SendIcon className="h-5 w-5" />,
    },
    {
      label: "Facebook",
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shortUrl)}`,
      icon: <FacebookIcon className="h-5 w-5" />,
    },
    {
      label: "Instagram",
      url: `https://www.instagram.com/?url=${encodeURIComponent(shortUrl)}`,
      icon: <InstagramIcon className="h-5 w-5" />,
    },
    {
      label: "Twitter",
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shortUrl)}`,
      icon: <TwitterIcon className="h-5 w-5" />,
    },
    {
      label: "Threads",
      url: `https://www.threads.net/intent/post?url=${encodeURIComponent(shortUrl)}`,
      icon: <Share2Icon className="h-5 w-5" />,
    },
    {
      label: "Email",
      url: `mailto:?subject=Check this link&body=${encodeURIComponent(shortUrl)}`,
      icon: <MailIcon className="h-5 w-5" />,
    },
    {
      label: "Telegram",
      url: `https://t.me/share/url?url=${encodeURIComponent(shortUrl)}`,
      icon: <MessageCircleIcon className="h-5 w-5" />,
    },
    {
      label: "YouTube",
      url: `https://www.youtube.com/`,
      icon: <YoutubeIcon className="h-5 w-5" />,
    },
  ];

  return (
    <div className="space-y-3">
      <Label>Enter your destination URL</Label>

      <Input
        ref={inputRef}
        placeholder="https://example.com/long-url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="mb-5"
      />

      <Button
        onClick={handleCreate}
        disabled={loading}
        className="py-5"
      >
        {loading ? "Creating..." : "Create Short Link"}
      </Button>

      {/* Generated Link Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Your link is ready</DialogTitle>
          </DialogHeader>

          <p className="text-sm text-muted-foreground mb-2">
            Copy your short link or share it below.
          </p>

          <div className="flex items-center gap-2 bg-muted px-2 py-1 rounded-md">
            <input
              readOnly
              className="text-sm bg-transparent w-full outline-none"
              value={shortUrl}
            />

            <Button
              size="sm"
              variant="ghost"
              onClick={handleCopy}
            >
              <CopyIcon className="h-4 w-4" />
            </Button>

            {copied && (
              <span className="text-green-600 text-xs">Copied!</span>
            )}
          </div>

          <div className="grid grid-cols-4 gap-2 mt-4">
            {shareTargets.map((action) => (
              <a
                key={action.label}
                href={action.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-1 text-xs hover:text-primary"
              >
                {action.icon}
                {action.label}
              </a>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
