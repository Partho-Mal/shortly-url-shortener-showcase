"use client";

import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertCircleIcon,
  CopyIcon,
  FacebookIcon,
  InstagramIcon,
  TwitterIcon,
  SendIcon,
  Share2Icon,
  MailIcon,
  MessageCircleIcon,
  YoutubeIcon,
  Lock,
} from "lucide-react";
import { TooltipOrDrawer } from "./TooltipOrDrawer";
import { toast } from "sonner";


const API_URL = process.env.NEXT_PUBLIC_API_URL!;
const BACKEND_DOMAIN = process.env.NEXT_PUBLIC_BACKEND_URL || "";
const OPTIONALCREATION = process.env.NEXT_PUBLIC_OPTIONALCREATION!;

export default function AdvancedShortLinkForm() {
  const [originalUrl, setOriginalUrl] = useState("");
  const [slug, setSlug] = useState("");

  const [shortUrl, setShortUrl] = useState("");
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);


  const handleCreate = async () => {
    
    if (!originalUrl.trim()) {
      toast.error("Destination URL is required.");
      return;
    }

    if (slug && slug.trim().length < 3) {
      toast.error(
        "Back-half must be at least 3 characters and contain only letters, numbers, hyphens, or underscores."
      );
      return;
    }

    setLoading(true);

    interface Payload {
      original_url: string;
      slug?: string;
    }

    const payload: Payload = {
      original_url: originalUrl,
      slug: slug || undefined,

    };

    console.log("Sending payload:", payload);

    try {
      const res = await fetch(`${API_URL}${OPTIONALCREATION}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.slug) {
        setShortUrl(data.short_url ?? `${BACKEND_DOMAIN}/${data.slug}`);
        setOpen(true);
      } else {
        alert(data.error || "Failed to create short link.");
      }
    } catch {
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };


  const shareLinks = [
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
    <div className="space-y-5 max-w-xl mx-auto">
      <div>
        <Label>Destination URL</Label>
        <Input
          ref={inputRef}
          placeholder="https://example.com"
          value={originalUrl}
          onChange={(e) => setOriginalUrl(e.target.value)}
          className="mt-4"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="flex items-center gap-2 mt-3 md:mt-0">
            Domain
            <TooltipOrDrawer
              icon={<Lock className="w-4 h-4 cursor-help text-red-700" />}
              content={<p>Branded links aren&apos;t available currently. Coming Soon!</p>
}
              label="Branded links info"
            />
          </Label>
          <Input
            value={BACKEND_DOMAIN.replace(/^https?:\/\//, "")}
            disabled
            className="mt-4"
          />
        </div>

        <div>
          <Label>Custom back-half (optional)</Label>
          <Input
            placeholder="e.g. my-custom-slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="mt-4"
          />
        </div>
      </div>

      <div className="text-sm text-muted-foreground mt-4">
        Your short link will look like:{" "}
        <code>
          {BACKEND_DOMAIN.replace(/^https?:\/\//, "")}/
          <span className="text-blue-500">{slug || "your-slug"}</span>
        </code>
      </div>

      <Button className="w-full" onClick={handleCreate} disabled={loading}>
        {loading ? "Creating..." : "Create Short Link"}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent aria-describedby="dialog-description">
          <DialogHeader>
            <DialogTitle>Short Link Created!</DialogTitle>
          </DialogHeader>
            <p id="dialog-description" className="sr-only">
              This dialog shows the newly created short link and sharing options.
            </p>

          <div className="space-y-4">
            <div className="flex items-center gap-2 bg-muted px-3 py-2 rounded-md">
              <input
                readOnly
                className="text-sm font-mono bg-transparent w-full outline-none"
                value={shortUrl}
              />
              <Button size="sm" variant="outline" onClick={handleCopy}>
                <CopyIcon className="h-4 w-4 mr-1" />
                {copied ? "Copied!" : "Copy"}
              </Button>
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              {shareLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-sm hover:underline hover:text-primary transition"
                >
                  {link.icon}
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
