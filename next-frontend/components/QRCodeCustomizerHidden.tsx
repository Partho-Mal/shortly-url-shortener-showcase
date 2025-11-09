//  next-frontend/components/QRCodeCustomizerHidden.tsx
// ! For my Personal use only
// ? This QR code directly encodes the link (e.g., https://your-event.com)
// ? Do NOT encode or redirect via streamlab.in/{qr-code} — use the actual target URL
// ! This is not in production (if in production only for personal use of mine with hidden link)  NOT EXPOSED

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

// Valid QR styles
const validQrStyles = [
  "squares",
  "dots",
  "rounded",
  "circle",
  "mixed",
] as const;
export type QRStyle = (typeof validQrStyles)[number];

// Corner shapes for QR eyes
type CornerRadii =
  | number
  | [number, number, number, number]
  | {
      inner: number | [number, number, number, number];
      outer: number | [number, number, number, number];
    };

type EyeRadius = CornerRadii | [CornerRadii, CornerRadii, CornerRadii];

// Eye radius settings based on style
function getEyeRadius(qrStyle: QRStyle, size: number = 200): EyeRadius {
  const scale = size / 200; // 200 is your design baseline
  switch (qrStyle) {
    case "dots":
      return 10 * scale;
    case "rounded":
      return [
        { outer: [10*scale, 10*scale, 0, 10*scale], inner: 0 },
        { outer: [10*scale, 10*scale, 10*scale, 0], inner: 0 },
        { outer: [0, 10*scale, 10*scale, 10*scale], inner: 0 },
      ];
    case "circle":
      return [
        { outer: [15*scale, 15*scale, 15*scale, 15*scale], inner: 0 },
        { outer: [15*scale, 15*scale, 15*scale, 15*scale], inner: 0 },
        { outer: [15*scale, 15*scale, 15*scale, 15*scale], inner: 0 },
      ];
    case "mixed":
      return [
        { outer: [10*scale, 0, 10*scale, 0], inner: 0 },
        { outer: [0, 10*scale, 0, 10*scale], inner: 0 },
        { outer: [10*scale, 10*scale, 0, 0], inner: 0 },
      ];
    default:
      return 0;
  }
}

interface Props {
  url: string; 
}

export default function QRCodeCustomizerHidden({ url }: Props) {
  const [qrColor, setQRColor] = useState("#000000");
  const [qrStyle, setQRStyle] = useState<QRStyle>("squares");
  const [logoBase64, setLogoBase64] = useState<string | undefined>(undefined);
  const [uploadedFileName, setUploadedFileName] = useState<string | undefined>(
    undefined
  );

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name); // Save original name

    const reader = new FileReader();
    reader.onload = () => setLogoBase64(reader.result as string);
    reader.readAsDataURL(file);
  };

  const downloadQR = () => {
    const qrCanvas = document.getElementById(
      "qrCanvasHidden"
    ) as HTMLCanvasElement | null;
    if (!qrCanvas) return;

    const padding = 60; // pixels padding on each side

    // Create a new canvas with extra padding
    const paddedCanvas = document.createElement("canvas");
    paddedCanvas.width = qrCanvas.width + padding * 2;
    paddedCanvas.height = qrCanvas.height + padding * 2;

    const ctx = paddedCanvas.getContext("2d");
    if (!ctx) return;

    // Fill background white (optional)
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, paddedCanvas.width, paddedCanvas.height);

    // Draw QR in center with padding
    ctx.drawImage(qrCanvas, padding, padding);

    // Export padded version
    const link = document.createElement("a");
    link.download = "qr-code.png";
    link.href = paddedCanvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="border p-4 rounded-md bg-muted space-y-4">
      {/* Color Picker */}
      <div>
        <Label className="mb-2">QR Code Color</Label>
        <input
          type="color"
          value={qrColor}
          onChange={(e) => setQRColor(e.target.value)}
          className="mt-2 w-[20%] h-10 cursor-pointer"
        />
      </div>

      {/* Logo Upload */}
      <div className="mt-4">
        <Label className="mb-2 block">Upload Center Logo</Label>
        <label
          htmlFor="logoUpload"
          className="inline-flex items-center px-4 py-2 rounded-md cursor-pointer
                     text-white font-semibold select-none
                     bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500
                     bg-[length:200%_200%] animate-gradientShift
                     shadow-lg shadow-purple-800/30
                     transition-all duration-200 ease-in-out
                     hover:scale-95 active:scale-90
                     hover:shadow-xl active:shadow-md
                     focus:outline-none focus:ring-2 focus:ring-purple-300"
        >
          Upload Logo
        </label>
        <input
          type="file"
          id="logoUpload"
          accept="image/png,image/jpeg"
          onChange={handleLogoUpload}
          className="hidden"
        />
        {/* {logoBase64 && (
          <p className="mt-2 text-sm text-gray-700">
            Selected: {logoBase64.substring(0, 30)}...
          </p>
        )} */}
        {logoBase64 && (
          <div className="mt-2 flex items-center gap-2">
            {/* Logo preview */}
            <img
              src={logoBase64}
              alt="Logo preview"
              className="w-12 h-12 object-contain border rounded"
            />
            {/* File name */}
            <span className="text-sm text-gray-700 truncate max-w-[150px]">
              {uploadedFileName}
            </span>
          </div>
        )}
      </div>

      {/* QR Style Selector */}
      <div>
        <Label>QR Design</Label>
        <Select
          value={qrStyle}
          onValueChange={(value) => setQRStyle(value as QRStyle)}
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

      {/* QR Preview */}
      <div>
        <Label className="mb-2">QR Preview</Label>
        <div className="flex sm:justify-start justify-center">
          <div className="relative p-2 inline-block rounded border bg-white ">
            {/* <div className="scale-[0.2] origin-top-left"> */}

            {/* QR Code without logo */}
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
              removeQrCodeBehindLogo={true}
              logoPadding={1}
            />

            {/* </div> */}
          </div>
        </div>
      </div>

      {/* Download Button */}
      <Button onClick={downloadQR} className="w-full">
        Download QR Code
      </Button>
    </div>
  );
}
