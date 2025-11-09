"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import QRCodeCustomizerHidden from "@/components/QRCodeCustomizerHidden";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";

export default function HiddenQRPage() {
  const [url, setUrl] = useState("");
  

  return (
    <main className="p-6 max-w-2xl mx-auto space-y-6">
      <h1 className="text-xl font-bold">Raw URL to QRCode</h1>


    <Alert variant="destructive">
      <AlertDescription>
        Direct URL QR - embeds your link directly, bypassing our site and analytics.  
        For tracking, please visit{" "}
        <Link href="https://shortly.streamlab.in" className="underline font-medium" target="_blank">
          Shortly
        </Link>
      </AlertDescription>
    </Alert>

      <div>
        <Label htmlFor="url">Enter URL</Label>
        <Input
          id="url"
          placeholder="https://link.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="mt-2"
        />
      </div>

      {url && <QRCodeCustomizerHidden url={url} />}
    </main>
  );
}
