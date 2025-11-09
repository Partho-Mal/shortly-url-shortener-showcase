// app/dashboard/terms-of-service/page.tsx

/**
 * Renders the Terms of Service page.
 * Defines acceptable use and user responsibilities. Provides contact details.
 */

/**
 * Renders the Terms of Service page.
 * Defines acceptable use and user responsibilities. Provides contact details.
 */

import  Header  from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function TermsOfServicePage() {
  return (
    <div className="flex flex-col min-h-screen w-full">
      <Header />
      <main className="grow">
        <div className="max-w-3xl mx-auto py-10 px-4">
          <h1 className="text-3xl font-bold mb-4">Terms of Service</h1>

          <p className="mb-4">
            By using this application, you agree to use it responsibly and in
            compliance with all applicable laws. You are solely responsible for
            the content you create, share, or store through this platform.
          </p>

          <p className="mb-4">
            This service is provided on an &quot;as-is&quot; and
            &quot;as-available&quot; basis without warranties of any kind,
            including uptime, accuracy, or reliability. We do not guarantee
            uninterrupted access to the service.
          </p>

          <p className="mb-4">
            We reserve the right to suspend or terminate accounts at any time
            without prior notice, particularly in cases of abuse, fraud, or
            activity that violates applicable laws or our policies.
          </p>

          <p className="mb-4">
            By continuing to use the platform, you acknowledge and agree that we
            are not liable for any damages, losses, or misuse resulting from
            your activity.
          </p>

          <p className="mb-4">
            This platform is a <strong>showcase/demo</strong> version of a
            production-grade system. Some features may be limited or simplified.
            It is primarily intended to demonstrate engineering and product
            capabilities.
          </p>

          <p className="mb-4">
            For work, collaboration, or job opportunities, contact:
          </p>

          <p className="mb-4">
            <Link
              href="mailto:parthoma7@gmail.com"
              className="text-blue-600 hover:underline"
            >
              parthoma7@gmail.com
            </Link>
          </p>

          <p className="text-sm text-muted-foreground">
            These Terms may be updated occasionally. Continued use of the
            application indicates acceptance of the latest Terms.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}


