// next-frontend/app/dashboard/links/create/page.tsx

/**
 * Renders the page for creating a custom QR Code no analytics and no storing in Database.
 */

import QRCodeCustomizer from "@/components/QRCodeCustomizer";

export default function CreatePage() {
  const defaultUrl = "https://shortly.streamlab.in";

  return (
    <main className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-8">
        Create a Custom QR Code
      </h1>

      <QRCodeCustomizer url={defaultUrl} />
    </main>
  );
}
