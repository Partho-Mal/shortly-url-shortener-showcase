// components/ShortQRCodeForm.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { toast } from "sonner";
import Image from "next/image";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";


const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const PUBLIC_USER_QRCODE = process.env.NEXT_PUBLIC_USER_QRCODE;
const API_URL = process.env.NEXT_PUBLIC_API_URL!;
const OPTIONALCREATION = process.env.NEXT_PUBLIC_OPTIONALCREATION!;

interface ShortQRCodeFormProps {
  isActive: boolean;
}

export default function ShortQRCodeForm({ isActive }: ShortQRCodeFormProps) {
  const [url, setUrl] = useState("");
  const [qrId, setQrId] = useState("");
  const [qrUrl, setQrUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isActive) {
      setTimeout(() => {
        inputRef.current?.focus();
      });
    }
  }, [isActive]);

  // express QR code with default slug (no customization)
  const handleCreateQRCode = async () => {
    if (!url) return toast.error("Please enter a URL");

    try {
      setLoading(true);
      const response = await fetch(`${API_URL}${OPTIONALCREATION}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          original_url: url,
          generate_qrcode: true,
          qr_color: "#000000", // default black
          qr_style: "squares", // default boxy design
          eye_radius: JSON.stringify({
            outer: [0, 0, 0, 0],
            inner: [0, 0, 0, 0]
          }), // square eyes
        }),
      });

      if (!response.ok) throw new Error("QR code generation failed");

      const { slug } = await response.json();
      const qrImageUrl = `${BACKEND_BASE_URL}${PUBLIC_USER_QRCODE}/${slug}`;

      setQrId(slug);
      setQrUrl(qrImageUrl);
      toast.success("Shortened URL QR Code generated!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate QR Code");
    } finally {
      setLoading(false);
    }
  };


// // default qr code embedding with slug creation (No API Calls)
//   const handleCreateQRCode = async () => {
//   if (!url) return toast.error("Please enter a URL");

//   try {
//     setLoading(true);
//     const response = await fetch(`${BACKEND_BASE_URL}${PUBLIC_USER_QRCODE}`, {
//       method: "POST",
//       credentials: "include",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ original_url: url }), // Or include `slug`
//     });

//     if (!response.ok) throw new Error("QR code generation failed");

//     const { id } = await response.json(); // also expect `url`
//     const qrImageUrl = `${BACKEND_BASE_URL}${PUBLIC_USER_QRCODE}/${id}`;

//     setQrId(id);
//     setQrUrl(qrImageUrl);
//     toast.success("QR Code generated successfully");
//   } catch (err) {
//     console.error(err);
//     toast.error("Failed to generate QR Code");
//   } finally {
//     setLoading(false);
//   }
// };


  // const handleCreateQRCode = async () => {
  //   if (!url) return toast.error("Please enter a URL");

  //   try {
  //     setLoading(true);
  //     const response = await fetch(`${BACKEND_BASE_URL}${PUBLIC_USER_QRCODE}`, {
  //       method: "POST",
  //       credentials: "include",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ original_url: url }),
  //     });

  //     if (!response.ok) throw new Error("QR code generation failed");

  //     const { id } = await response.json();
  //     const qrImageUrl = `${BACKEND_BASE_URL}${PUBLIC_USER_QRCODE}/${id}`;

  //     setQrId(id);
  //     setQrUrl(qrImageUrl);

  //     toast.success("QR Code generated successfully");
  //   } catch (err) {
  //     console.error(err);
  //     toast.error("Failed to generate QR Code");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleDownload = async () => {
  try {
    const response = await fetch(qrUrl, { mode: "cors" });
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);

    const name = url
      .replace(/^https?:\/\//, "")
      .split("/")[0]
      .replace(/\W+/g, "_");

    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = `qr-code-${name || qrId}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Optional: clean up the blob URL
    URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error("Failed to download image:", error);
  }
};


  // const handleDownload = () => {
  //   const link = document.createElement("a");
  //   link.href = qrUrl;
  //   link.download = `qr-code-${qrId}.png`;
  //   document.body.appendChild(link);
  //   link.click();
  //   document.body.removeChild(link);
  // };

  return (
    <Card>
      <CardHeader>
        <CardTitle>QR Code Generator</CardTitle>
          <CardDescription>
            Generate a QR code with short link
            <span className="text-yellow-600 ml-1">(express — no customization)</span>
          </CardDescription>
      </CardHeader>

      <CardContent className="grid gap-4">
        <Label htmlFor="url">Destination URL</Label>
        <Input
          ref={inputRef}
          id="url"
          placeholder="https://example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
      </CardContent>

      <CardFooter className="flex flex-col items-start gap-4">
        <Button onClick={handleCreateQRCode} disabled={loading}>
          {loading ? "Generating..." : "Generate QR Code"}
        </Button>

        {qrUrl && (
          <div className="border p-4 rounded w-full max-w-xs">
            <Label className="mb-2 block">QR Code Preview</Label>

            <Dialog>
              <DialogTrigger asChild>
                <Image
                  src={qrUrl}
                  alt="QR Code"
                  width={200}
                  height={200}
                  className="cursor-pointer rounded border hover:shadow-md"
                />
              </DialogTrigger>
              <DialogContent className="flex justify-center items-center">
                <Image
                  src={qrUrl}
                  alt="QR Code Preview"
                  width={400}
                  height={400}
                  className="rounded"
                />
              </DialogContent>
            </Dialog>

            <Label className="mt-3 block text-xs text-gray-500">
              Original URL:
            </Label>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-sm text-blue-500 hover:underline break-words"
            >
              {url}
            </a>

            <Button
              variant="outline"
              size="sm"
              className="mt-3 w-full"
              onClick={handleDownload}
            >
              Download PNG
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
