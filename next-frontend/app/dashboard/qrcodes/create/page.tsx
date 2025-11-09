"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import QRCodeCustomizer, {
  QRStyle,
  getEyeRadius,
} from "@/components/QRCodeCustomizer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;
const OPTIONALCREATION = process.env.NEXT_PUBLIC_OPTIONALCREATION!;

export default function CreatePage() {
  const router = useRouter();
  const [originalUrl, setOriginalUrl] = useState(""); // ✅ user-entered URL
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [generateQR, setGenerateQR] = useState(true);
  const [qrColor, setQRColor] = useState("#000000");
  const [qrStyle, setQRStyle] = useState<QRStyle>("squares");
  const [logoBase64, setLogoBase64] = useState<string | null>(null);
  const [logoError, setLogoError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const logoBase64Ref = useRef<string | null>(null);

  const handleCreate = async () => {
    if (!originalUrl.trim()) {
      alert("Please enter a valid URL");
      return;
    }

    setIsSubmitting(true);

    const payload = {
      original_url: originalUrl, // ✅ use user input
      generate_qrcode: generateQR,
      qr_color: generateQR ? qrColor : undefined,
      qr_style: generateQR ? qrStyle : undefined,
      qr_logo: generateQR && logoBase64Ref.current ? logoBase64Ref.current : undefined,
      eye_radius: generateQR ? JSON.stringify(getEyeRadius(qrStyle)) : undefined,
    };

    try {
      const res = await fetch(`${API_URL}${OPTIONALCREATION}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Something went wrong.");
      } else {
        router.push("/dashboard/qrcodes");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Failed to submit QR customization.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="p-6 max-w-2xl mx-auto space-y-6">
      <h1 className="text-xl font-bold">Create QR Code</h1>

      <div>
        <Label htmlFor="originalUrl">Enter URL to Encode</Label>
        <Input
          id="originalUrl"
          placeholder="https://example.com"
          value={originalUrl}
          onChange={(e) => setOriginalUrl(e.target.value)}
          className="mt-2"
        />
      </div>

      {generateQR && originalUrl && (
        <QRCodeCustomizer
          url={originalUrl}
          qrColor={qrColor}
          qrStyle={qrStyle}
          logoBase64={logoBase64}
          setQRColor={setQRColor}
          setQRStyle={setQRStyle}
          setLogoBase64={setLogoBase64}
          logoError={logoError}
          setLogoError={setLogoError}
          logoBase64Ref={logoBase64Ref}
        />
      )}

      <Button className="w-full" onClick={handleCreate} disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Create QR Code"}
      </Button>
    </main>
  );
}
