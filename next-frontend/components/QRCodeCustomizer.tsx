// components/QRCodeCustomizer.tsx

/**
 * QR Code customizer for generating QR codes that directly encode the target URL.
 * This does not route through the backend or analytics.
 *
 * Intended for lightweight usage (non-auth required).
 * Not connected to domain-based redirection.
 */

"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { QRCode } from "react-qrcode-logo";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

/**
 * Supported QR code visual styles
 */
const validQrStyles = ["squares", "dots", "rounded", "circle", "mixed"] as const;
export type QRStyle = (typeof validQrStyles)[number];

/**
 * Corner configuration types for QR eye rendering
 */
type CornerRadii =
  | number
  | [number, number, number, number]
  | {
      inner: number | [number, number, number, number];
      outer: number | [number, number, number, number];
    };

type EyeRadius = CornerRadii | [CornerRadii, CornerRadii, CornerRadii];

/**
 * Computes eye radius configuration based on style and size
 */
function getEyeRadius(qrStyle: QRStyle, size: number = 200): EyeRadius {
  const scale = size / 200;

  switch (qrStyle) {
    case "dots":
      return 10 * scale;

    case "rounded":
      return [
        { outer: [10 * scale, 10 * scale, 0, 10 * scale], inner: 0 },
        { outer: [10 * scale, 10 * scale, 10 * scale, 0], inner: 0 },
        { outer: [0, 10 * scale, 10 * scale, 10 * scale], inner: 0 },
      ];

    case "circle":
      return [
        { outer: [15 * scale, 15 * scale, 15 * scale, 15 * scale], inner: 0 },
        { outer: [15 * scale, 15 * scale, 15 * scale, 15 * scale], inner: 0 },
        { outer: [15 * scale, 15 * scale, 15 * scale, 15 * scale], inner: 0 },
      ];

    case "mixed":
      return [
        { outer: [10 * scale, 0, 10 * scale, 0], inner: 0 },
        { outer: [0, 10 * scale, 0, 10 * scale], inner: 0 },
        { outer: [10 * scale, 10 * scale, 0, 0], inner: 0 },
      ];

    default:
      return 0;
  }
}

interface Props {
  /** Target URL to encode directly into the QR */
  url: string;
}

export default function QRCodeCustomizer({ url }: Props) {
  /**
   * UI state
   */
  const [qrColor, setQrColor] = useState("#000000");
  const [qrStyle, setQrStyle] = useState<QRStyle>("squares");

  const [logoBase64, setLogoBase64] = useState<string | undefined>(undefined);
  const [uploadedFileName, setUploadedFileName] = useState<string | undefined>();

  /**
   * Reads uploaded image, stores base64 + filename
   */
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);

    const reader = new FileReader();
    reader.onload = () => setLogoBase64(reader.result as string);
    reader.readAsDataURL(file);
  };

  /**
   * Saves QR code PNG with padding
   */
  const downloadQR = (): void => {
    const qrCanvas = document.getElementById("qrCanvasHidden") as HTMLCanvasElement | null;
    if (!qrCanvas) return;

    const padding = 60;
    const paddedCanvas = document.createElement("canvas");

    paddedCanvas.width = qrCanvas.width + padding * 2;
    paddedCanvas.height = qrCanvas.height + padding * 2;

    const context = paddedCanvas.getContext("2d");
    if (!context) return;

    context.fillStyle = "#FFFFFF";
    context.fillRect(0, 0, paddedCanvas.width, paddedCanvas.height);
    context.drawImage(qrCanvas, padding, padding);

    const link = document.createElement("a");
    link.download = "qr-code.png";
    link.href = paddedCanvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="border p-4 rounded-md bg-muted space-y-4">
      {/* QR color */}
      <div>
        <Label>QR Code Color</Label>
        <input
          type="color"
          value={qrColor}
          onChange={(e) => setQrColor(e.target.value)}
          className="mt-2 w-[20%] h-10 cursor-pointer"
        />
      </div>

      {/* Logo upload */}
      <div>
        <Label>Upload Center Logo</Label>

        <label
          htmlFor="logoUpload"
          className="inline-flex items-center px-4 py-2 rounded-md cursor-pointer text-white font-semibold select-none bg-linear-to-r from-purple-500 via-pink-500 to-blue-500 bg-size-[200%_200%] animate-gradientShift shadow-lg shadow-purple-800/30 transition-all duration-200 ease-in-out hover:scale-95 active:scale-90 hover:shadow-xl active:shadow-md focus:outline-none focus:ring-2 focus:ring-purple-300" >
          Upload Logo
        </label>

        <input
          id="logoUpload"
          type="file"
          accept="image/png,image/jpeg"
          className="hidden"
          onChange={handleLogoUpload}
        />

        {logoBase64 && (
          <div className="mt-2 flex items-center gap-2">
            <img
              src={logoBase64}
              alt="Logo preview"
              className="w-12 h-12 border rounded object-contain"
            />
            <span className="text-sm text-gray-700 truncate max-w-[150px]">
              {uploadedFileName}
            </span>
          </div>
        )}
      </div>

      {/* QR style selection */}
      <div>
        <Label>QR Design</Label>
        <Select
          value={qrStyle}
          onValueChange={(v) => setQrStyle(v as QRStyle)}
        >
          <SelectTrigger className="w-full mt-2">
            <SelectValue placeholder="Select QR Design" />
          </SelectTrigger>

          <SelectContent>
            {validQrStyles.map((style) => (
              <SelectItem key={style} value={style}>
                {style[0].toUpperCase() + style.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* QR preview */}
      <div>
        <Label>QR Preview</Label>

        <div className="flex justify-center sm:justify-start">
          <div className="relative p-2 inline-block rounded border bg-white">
            <QRCode
              id="qrCanvasHidden"
              value={url}
              size={800}
              quietZone={20}
              style={{ width: "200px", height: "200px" }}
              qrStyle={qrStyle === "dots" ? "dots" : "squares"}
              eyeRadius={getEyeRadius(qrStyle)}
              fgColor={qrColor}
              logoImage={logoBase64}
              logoWidth={130}
              logoHeight={130}
              logoOpacity={1}
              removeQrCodeBehindLogo
              logoPadding={1}
            />
          </div>
        </div>
      </div>

      <Button onClick={downloadQR} className="w-full">
        Download QR Code
      </Button>
    </div>
  );
}
