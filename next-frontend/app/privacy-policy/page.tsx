import Footer from "@/components/Footer";
import  Header from "@/components/Header";
import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <div className="flex flex-col min-h-screen w-full">
      <Header />
      <main className="flex-grow">
        <div className="max-w-3xl mx-auto py-10 px-4">
          <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
          <p className="mb-4">
            This application, Shortly (https://shortly.streamlab.in), uses Google Login for authentication purposes only.
            We do not collect, store, or share any personal data beyond what is required to authenticate you via Google.
          </p>
          <p className="mb-4">
            Your email and basic profile information (name and profile image) may be used to personalize your experience,
            but none of this data is stored on our servers without your explicit consent.
          </p>
          <p className="mb-4">
            We are committed to protecting your privacy. If you have any questions or concerns, feel free to contact us at{" "}
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
