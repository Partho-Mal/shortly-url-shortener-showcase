import  Header  from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

// app/terms-of-service/page.tsx
export default function TermsOfServicePage() {
  return (
    <div className="flex flex-col min-h-screen w-full">
      <Header />
      <main className="flex-grow">
        <div className="max-w-3xl mx-auto py-10 px-4">
          <h1 className="text-3xl font-bold mb-4">Terms of Service</h1>
          <p className="mb-4">
            By using this application, you agree to use it responsibly and in
            compliance with all applicable laws. We do not take responsibility for
            any misuse or illegal activity carried out using this service.
          </p>
          <p className="mb-4">
            This service is provided &quot;as is&quot; without warranties of any
            kind. We do not guarantee uptime, accuracy, or availability at all
            times.
          </p>
          <p className="mb-4">
            We reserve the right to suspend or terminate your access to the service
            at any time without notice, especially in case of abuse.
          </p>
          <p className="mb-4">
            If you have any questions about these terms, you can reach out to us at{" "}
            <Link
              href="https://mail.google.com/mail/?view=cm&fs=1&to=support@streamlab.in&su=Support%20Request&body=Hi%20team,"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              support@streamlab.in
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
