// components/ShortLinksList.tsx

/**
 * ShortLinksList
 *
 * Displays authenticated user short links.
 * Provides:
 *   • Navigate to original URL
 *   • Copy short link
 *   • Delete link
 *   • View visits + last activity
 */

"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {
  Copy,
  Check,
  Trash,
  BarChartIcon,
} from "lucide-react";

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

/**
 * Env endpoints (resolved once)
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";
const USER_SHORT_LINKS_ENDPOINT = process.env.NEXT_PUBLIC_USER_SHORTLINKS ?? "";
const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "";
const DELETE_ENDPOINT = process.env.NEXT_PUBLIC_DELETE_SHORTLINK_ENDPOINT ?? "";

/**
 * Short link model shape
 */
interface ShortLink {
  id: string;
  original_url: string;
  slug: string;
  created_at: string;
  created_qrcode: boolean;
  click_count: number;
  last_clicked_at: string | null;
}

export default function ShortLinksList() {
  const [links, setLinks] = useState<ShortLink[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [copiedMap, setCopiedMap] = useState<Record<string, boolean>>({});
  const router = useRouter();

  /**
   * Fetches authenticated user short links
   */
  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const url = new URL(`${API_BASE_URL}${USER_SHORT_LINKS_ENDPOINT}`);
        const response = await fetch(url.toString(), {
          credentials: "include",
        });

        const data = await response.json();
        setLinks(data);
      } catch (error) {
        console.error("Failed to fetch links:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLinks();
  }, []);

  /**
   * Removes a short link
   */
  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(
        `${BACKEND_BASE_URL}${DELETE_ENDPOINT}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ id }),
        }
      );

      if (!response.ok) {
        console.error("Delete failed:", await response.text());
        alert("Failed to delete link.");
        return;
      }

      setLinks((prev) => prev?.filter((l) => l.id !== id) ?? []);
    } catch (error) {
      console.error("Error deleting link:", error);
      alert("Something went wrong.");
    }
  };

  /**
   * Copies short URL to clipboard, shows temporary feedback
   */
  const handleCopy = (id: string, shortUrl: string) => {
    navigator.clipboard.writeText(shortUrl);

    setCopiedMap((prev) => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setCopiedMap((prev) => ({ ...prev, [id]: false }));
    }, 2000);
  };

  /**
   * Builds display short link
   */
  const getShortUrl = (slug: string): string => {
    return `${BACKEND_BASE_URL}/${slug}`;
  };

  return (
    <Card className="p-4">
      <CardHeader>
        <CardTitle>My Shortened Links</CardTitle>
      </CardHeader>

      <CardContent className="grid gap-4">
        {loading ? (
          Array.from({ length: 2 }).map((_, index) => (
            <div key={index} className="grid gap-2">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-1/3" />
            </div>
          ))
        ) : links?.length ? (
          links.map((link) => {
            const shortUrl = getShortUrl(link.slug);

            return (
              <div
                key={link.id}
                className="relative p-4 pb-12 border rounded-xl bg-muted/30 hover:shadow-sm transition"
              >
                {/* Delete */}
                <AlertDialog>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <AlertDialogTrigger asChild>
                          <button
                            className="absolute top-3 right-3 p-2 rounded-full hover:bg-red-100 transition"
                            aria-label={`Delete ${link.slug}`}
                          >
                            <Trash className="h-4 w-4 text-red-500 hover:text-red-600" />
                          </button>
                        </AlertDialogTrigger>
                      </TooltipTrigger>
                      <TooltipContent side="left">
                        Delete this link
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <AlertDialogContent className="sm:max-w-md">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirm removal</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete{" "}
                        <b>{link.slug}</b> for{" "}
                        <b>{link.original_url}</b>.
                        {link.created_qrcode && (
                          <div className="text-red-500 mt-1">
                            Related QR codes will also be deleted.
                          </div>
                        )}
                      </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(link.id)}
                      >
                        Yes, delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                {/* Original URL */}
                <div className="font-medium break-all">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                    <span className="text-muted-foreground">
                      Original:
                    </span>

                    <a
                      href={
                        link.original_url.startsWith("http")
                          ? link.original_url
                          : `https://${link.original_url}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline break-all"
                    >
                      {link.original_url}
                    </a>
                  </div>
                </div>

                {/* Short Link + Copy */}
                <div className="mt-2 text-sm flex flex-wrap items-center gap-x-2 gap-y-1 break-all">
                  <span className="text-muted-foreground">
                    Short Link:
                  </span>

                  <a
                    href={shortUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Badge
                      variant="outline"
                      className="h-8 px-2 text-xs font-medium cursor-pointer
                                 hover:bg-primary/10 text-transparent bg-clip-text
                                 bg-linear-to-r from-indigo-400 via-purple-500 to-pink-500
                                 max-w-full"
                    >
                      {shortUrl.replace(/^https?:\/\//, "")}
                    </Badge>
                  </a>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          onClick={() => handleCopy(link.id, shortUrl)}
                          className="flex items-center gap-1 px-2 py-1 text-xs sm:text-sm rounded-md border hover:bg-muted transition text-muted-foreground hover:text-primary"
                        >
                          {copiedMap[link.id] ? (
                            <>
                              <span className="text-green-600">
                                Link Copied
                              </span>
                              <Check className="h-4 w-4 text-green-600" />
                            </>
                          ) : (
                            <>
                              <Copy className="h-4 w-4" />
                              <span className="hidden sm:inline">
                                Copy
                              </span>
                            </>
                          )}
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="top">
                        Copy short link
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

                {/* Stats */}
                <div className="mt-2 text-xs text-muted-foreground">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2 space-y-1 sm:space-y-0">
                    <div className="flex items-center gap-1">
                      <BarChartIcon className="h-4 w-4 text-red-600" />
                      <span>
                        Visits:{" "}
                        <span className="font-semibold">
                          {link.click_count}
                        </span>
                      </span>
                    </div>

                    {link.last_clicked_at && (
                      <div className="flex items-center gap-1">
                        <span className="hidden sm:inline">|</span>
                        <span>
                          Last clicked:{" "}
                          {format(
                            new Date(link.last_clicked_at),
                            "dd MMM yyyy, HH:mm"
                          )}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-sm text-muted-foreground">
            No links found.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
