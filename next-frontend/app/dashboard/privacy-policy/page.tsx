// app/dashboard/privacy-policy/page.tsx

/**
 * Renders the Privacy Policy page.
 * Describes how authentication data is handled and how users can contact for inquiries.
 */

import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <div className="flex flex-col min-h-screen w-full">
      <main className="grow">
        <div className="max-w-3xl mx-auto py-10 px-4">
          <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>

          <p className="mb-4">
            This application uses Google Login solely for user authentication.
            We do not sell, rent, or trade your personal information.
          </p>

          <p className="mb-4">
            During authentication, we may access basic information such as
            your name and email address. This is only used to identify your
            account within the platform.
          </p>

          <p className="mb-4">
            No sensitive information is collected without your consent.
            Authentication data may be stored only for login, session handling,
            and security purposes. We do not share this data with third parties.
          </p>

          <p className="mb-4">
            If you have any questions, concerns, or wish to discuss work
            or opportunities, you may contact us at:
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
            This policy may be updated occasionally. Continued usage of the
            application implies acceptance of the latest version.
          </p>
        </div>
      </main>
    </div>
  );
}
