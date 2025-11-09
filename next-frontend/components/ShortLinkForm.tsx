//components/ShortLinkForm.tsx
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
import { Label } from "./ui/label";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;
const BACKEND_DOMAIN = process.env.NEXT_PUBLIC_BACKEND_URL!;

interface ShortLinkFormProps {
  isActive: boolean;
  }


export default function ShortLinkForm({ isActive }: ShortLinkFormProps) {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isActive) {
      const timeout = setTimeout(() => {
        inputRef.current?.focus();
      }, 100); // small delay to wait for TabsContent to render fully
      return () => clearTimeout(timeout);
    }
  }, [isActive]);


  // useEffect(() => {
  // if (!isActive || !inputRef.current) return;

  // const observer = new IntersectionObserver(
  //   (entries) => {
  //     const [entry] = entries;
  //     if (entry.isIntersecting) {
  //       setTimeout(() => {
  //         inputRef.current?.focus();
  //       }, 50); // Delay helps after DOM paint
  //     }
  //   },
  //   {
  //     threshold: 1.0,
  //   }
  // );

  // observer.observe(inputRef.current);

  // return () => {
  //     observer.disconnect();
  //   };
  // }, [isActive]);

  
  // useEffect(() => {
  //   if (isActive) {
  //     setTimeout(() => {
  //       inputRef.current?.focus();
  //     });
  //   }
  // }, [isActive]);


  const handleCreate = async () => {
    if (!url) return;
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/shorten`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ original_url: url }),
      });

      const data = await res.json();
      console.log("Shorten Response:", data);
      if (res.ok && data.slug) {
        setShortUrl(data.short_url ?? `${BACKEND_DOMAIN}/${data.slug}`);
        setOpen(true);
      } else {
        alert(data.error || "Failed to shorten URL");
      }
    } catch {
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500); // Hide after 1.5 seconds
  };

  const shareLinks = [
    {
      label: "WhatsApp",
      url: `https://wa.me/?text=${encodeURIComponent(shortUrl)}`,
      icon: <SendIcon className="h-5 w-5" />,
    },
    {
      label: "Facebook",
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        shortUrl
      )}`,
      icon: <FacebookIcon className="h-5 w-5" />,
    },
    {
      label: "Instagram",
      url: `https://www.instagram.com/?url=${encodeURIComponent(shortUrl)}`,
      icon: <InstagramIcon className="h-5 w-5" />,
    },
    {
      label: "Twitter",
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(
        shortUrl
      )}`,
      icon: <TwitterIcon className="h-5 w-5" />,
    },
    {
      label: "Threads",
      url: `https://www.threads.net/intent/post?url=${encodeURIComponent(
        shortUrl
      )}`,
      icon: <Share2Icon className="h-5 w-5" />,
    },
    {
      label: "Email",
      url: `mailto:?subject=Check this link&body=${encodeURIComponent(
        shortUrl
      )}`,
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
      <Label htmlFor="tabs-demo-name">Enter your destination URL</Label>
      <Input
        ref={inputRef}
        className="mb-5"
        placeholder="https://example.com/long-url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <Button onClick={handleCreate} disabled={loading} className="py-5">
        {loading ? "Creating..." : "Create your Short link"}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Your link is ready!</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground mb-2">
            Copy the link below to share it or choose a platform to share it to.
          </p>
          <div className="flex items-center gap-2 bg-muted px-2 py-1 rounded-md">
            <input
              readOnly
              className="text-sm bg-transparent w-full outline-none"
              value={shortUrl}
            />
            <Button size="sm" variant="ghost" onClick={handleCopy}>
              <CopyIcon className="h-4 w-4" />
            </Button>
            {copied && <span className="text-green-600 text-xs">Copied!</span>}
          </div>

          <div className="grid grid-cols-4 gap-2 mt-4">
            {shareLinks.map((platform) => (
              <a
                key={platform.label}
                href={platform.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-1 text-xs hover:text-primary"
              >
                {platform.icon}
                {platform.label}
              </a>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
