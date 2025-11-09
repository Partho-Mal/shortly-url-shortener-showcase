// components/Footer.tsx

import Link from "next/link";
// import Image from "next/image";


export default function Footer() {
  return (
    <footer className="w-full bg-gradient-to-t from-slate-200 to-slate-100 dark:from-zinc-700 dark:to-zinc-800 text-sm text-gray-700 dark:text-gray-300 shadow-inner pt-8 pb-6 transition-colors duration-500">
      <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0">
        <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
          <p>
            &copy; {new Date().getFullYear()}{" "}
            <Link href="/" className="hover:underline font-medium">
              Shortly
            </Link>{" "}
            by{" "}
            <Link href="/" className="hover:underline font-medium">
              Streamlab.in
            </Link>
            . All rights reserved.
          </p>
          <p className="text-xs mt-1">
            Owned and maintained by{" "}
            <strong>
              <Link
                href="https://streamlab.in"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                Streamlab
              </Link>
            </strong>{" "}
            (developer).
          </p>
        </div>
        <div className="flex space-x-4 text-sm items-center">
          <Link href="/privacy-policy" className="hover:underline">
            Privacy Policy
          </Link>
          <Link href="/terms-of-service" className="hover:underline">
            Terms of Service
          </Link>
          {/* <div>
            <a
              href="https://www.producthunt.com/products/url?embed=true&utm_source=badge-featured&utm_medium=badge&utm_campaign=shortly-url-shortener"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block"
            >
              <Image
                src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=989622&theme=neutral&t=1751916580981"
                alt="Shortly  URL Shortener on Product Hunt"
                width={200}
                height={50}
                className="w-full h-auto"
              />
            </a>
          </div> */}
        </div>
      </div>
    </footer>
  );
}
