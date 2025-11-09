//components/ShortLinkslist.tsx
"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { Copy, Check, ScanQrCode, Trash, BarChartIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useRouter } from "next/navigation";
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
// import { Button } from "./ui/button";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";
const USER_SHORT_LINKS_ENDPOINT = process.env.NEXT_PUBLIC_USER_SHORTLINKS || "";
const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || ""; // for slug URL

// type ShortLink = {
//   id: string;
//   original_url: string;
//   slug: string;
//   created_at: string;
//   created_qrcode: boolean;
// };
type ShortLink = {
  id: string;
  original_url: string;
  slug: string;
  created_at: string;
  created_qrcode: boolean;
  click_count: number;
  last_clicked_at: string | null;
};


export default function ShortLinksList() {
  const [links, setLinks] = useState<ShortLink[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [generatingId, setGeneratingId] = useState<string | null>(null);
  const [copiedMap, setCopiedMap] = useState<Record<string, boolean>>({});
  const router = useRouter();

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const url = new URL(`${API_BASE_URL}${USER_SHORT_LINKS_ENDPOINT}`);
        const res = await fetch(url.toString(), {
          credentials: "include",
        });
        const json = await res.json();
        setLinks(json);
      } catch (err) {
        console.error("Failed to fetch links:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLinks();
  }, []);

  return (
    <Card className="p-4">
      <CardHeader>
        <CardTitle>My Shortened Links</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        {loading ? (
          Array.from({ length: 2 }).map((_, idx) => (
            <div key={idx} className="grid gap-2">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-1/3" />
            </div>
          ))
        ) : links?.length ? (
          links.map((link) => (
            <div
              key={link.id}
              className="relative p-4 pb-12 border rounded-xl bg-muted/30 hover:shadow-sm transition"
            >
              {/* 🗑️ Delete icon top-right */}
              <AlertDialog>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <AlertDialogTrigger asChild>
                        <button className="absolute top-3 right-3 p-2 rounded-full hover:bg-red-100 transition">
                          <Trash className="h-4 w-4 text-red-500 hover:text-red-600" />
                        </button>
                      </AlertDialogTrigger>
                    </TooltipTrigger>
                    <TooltipContent side="left">
                      Delete this shortlink
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <AlertDialogContent className="sm:max-w-md">
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you sure you want to delete?
                    </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the short link{" "}
                        <b>{link.slug}</b> for <b>{link.original_url}</b>.
                        {link.created_qrcode && (
                          <>
                            <br />
                            <span className="text-red-500">
                              A QR Code was generated for this link — it will also be deleted.
                            </span>
                          </>
                        )}
                      </AlertDialogDescription>
                    {/* <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      the short link <b>{link.slug}</b> for{" "}
                      <b>{link.original_url}</b>.
                    </AlertDialogDescription> */}
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={async () => {
                        try {
                          const res = await fetch(
                            `${BACKEND_BASE_URL}${process.env.NEXT_PUBLIC_DELETE_SHORTLINK_ENDPOINT}`,
                            {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              credentials: "include",
                              body: JSON.stringify({ id: link.id }),
                            }
                          );

                          if (!res.ok) {
                            const errText = await res.text();
                            console.error("Delete failed:", errText);
                            alert("Failed to delete link");
                            return;
                          }

                          setLinks(
                            (prev) =>
                              prev?.filter((l) => l.id !== link.id) || []
                          );
                        } catch (error) {
                          console.error(error);
                          alert("Something went wrong");
                        }
                      }}
                    >
                      Yes, Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              {/* <div className="font-medium break-words">
                <span className="text-muted-foreground">Original: </span>
                <a
                  href={
                    link.original_url.startsWith("http")
                      ? link.original_url
                      : `https://${link.original_url}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  {link.original_url}
                </a>
              </div> */}
              <div className="font-medium break-words">
                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                  <span className="text-muted-foreground">Original:</span>
                  <a
                    href={
                      link.original_url.startsWith("http")
                        ? link.original_url
                        : `https://${link.original_url}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline break-all _text-blue-600"
                  >
                    {link.original_url}
                  </a>
                </div>
              </div>


              <div className="mt-2 text-sm flex flex-wrap items-center gap-x-2 gap-y-1 break-all">
                <span className="text-muted-foreground">Short Link:</span>

                <a
                  href={`${BACKEND_BASE_URL}/${link.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Badge
                    variant="outline"
                    className="h-8 px-2 text-xs font-medium cursor-pointer hover:bg-primary/10 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 max-w-full"
                  >
                    {`${BACKEND_BASE_URL}/${link.slug}`.replace(/^https?:\/\//, "")}
                  </Badge>
                </a>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => {
                          const shortUrl = `${BACKEND_BASE_URL}/${link.slug}`;
                          navigator.clipboard.writeText(shortUrl);
                          setCopiedMap((prev) => ({ ...prev, [link.id]: true }));
                          setTimeout(() => {
                            setCopiedMap((prev) => ({ ...prev, [link.id]: false }));
                          }, 2000);
                        }}
                        className="flex items-center gap-1 px-2 py-1 text-xs sm:text-sm rounded-md border hover:bg-muted transition text-muted-foreground hover:text-primary"
                      >
                        {copiedMap[link.id] ? (
                          <>
                            <span className="text-green-500 whitespace-nowrap">
                              Link Copied
                            </span>
                            <Check className="h-4 w-4 text-green-500" />
                          </>
                        ) : (
                          <>
                            <Copy className="h-4 w-4" />
                            <span className="hidden sm:inline">Copy</span>
                          </>
                        )}
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="top">Copy short link</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>


              {/* <div className="mt-1 text-sm">
                <span className="text-muted-foreground">Short Link: </span>
                <a
                  href={`${BACKEND_BASE_URL}/${link.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Badge
                    variant="outline"
                    className="cursor-pointer hover:bg-primary/10 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500"
                  >
                    {`${BACKEND_BASE_URL}/${link.slug}`.replace(
                      /^https?:\/\//,
                      ""
                    )}
                  </Badge>
                </a>
              </div> */}

              

              {/* <div className="mt-1 text-xs text-muted-foreground">
                Created At:{" "}
                {format(new Date(link.created_at), "dd MMM yyyy, HH:mm")}
              </div> */}

              <div className="mt-2 text-xs text-muted-foreground">
                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2 space-y-1 sm:space-y-0">
                  <div className="flex items-center gap-1">
                    <BarChartIcon className="h-4 w-4 text-red-600" />
                    <span>
                      Visits: <span className="font-semibold">{link.click_count}</span>
                    </span>
                  </div>
                  
                  {link.last_clicked_at && (
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <span className="hidden sm:inline">|</span>
                      <span>
                        Last clicked: {format(new Date(link.last_clicked_at), "dd MMM yyyy, HH:mm")}
                      </span>
                    </div>
                  )}
                </div>
              </div>



              {/* <button
                onClick={() => router.push(`/dashboard/links/edit/${link.slug}`)}
                className="absolute bottom-3 left-3 p-2 rounded-full hover:bg-blue-100 transition flex items-center gap-1"
                aria-label="Edit shortlink"
              >
                <Pencil className="w-4 h-4 text-blue-500" />
                <span className="text-sm text-blue-500">Edit</span>
              </button> */}





              {/* ✅ QR code icon button if not created yet */}
              {/* {!link.created_qrcode && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={async () => {
                          try {
                            setGeneratingId(link.id);
                            const res = await fetch(
                              `${BACKEND_BASE_URL}/api/qr-code-links`,
                              {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                credentials: "include",
                                body: JSON.stringify({ slug: link.slug }),
                              }
                            );

                            if (!res.ok) {
                              const errRes = await res.text();
                              console.error("Server response:", errRes);
                              throw new Error("Failed to create QR code");
                            }

                            router.push("/dashboard/qrcodes");
                          } catch (err) {
                            console.error(err);
                            alert("Error creating QR code");
                          } finally {
                            setGeneratingId(null);
                          }
                        }}
                        disabled={generatingId === link.id}
                        className="absolute bottom-3 right-3 p-2 rounded-full hover:bg-primary/10 transition"
                      >
                        <ScanQrCode
                          className={`h-5 w-5 ${
                            generatingId === link.id
                              ? "animate-spin text-primary"
                              : "text-muted-foreground hover:text-primary"
                          }`}
                        />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      Want to create QR code for this URL?
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )} */}
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">No links found.</p>
        )}
      </CardContent>
    </Card>
  );
}
