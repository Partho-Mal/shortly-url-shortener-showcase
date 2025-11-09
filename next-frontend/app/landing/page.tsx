// app/landing/page.tsx
'use client';

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  // Sparkles,
  // MoveRight,
  Link,
  ShieldCheck,
  BarChart3,
  Clock,
  // DollarSignIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import  Header  from "@/components/Header";
import Footer from "@/components/Footer";
import VideoPlayerSmart from "@/components/VideoPlayerSmart";
import NoLoginShortenLinkForm from "@/components/NoLoginShortenLinkForm";


export default function LandingPage() {
  const router = useRouter();
  const [url, setUrl] = useState("");

  const isValidUrl = (input: string) => {
    try {
      new URL(input.startsWith("http") ? input : `https://${input}`);
      return true;
    } catch {
      return false;
    }
  };

    const handleFakeShorten = () => {
    if (!url.trim()) {
        toast("Missing URL", {
        description: "Please paste a link to get started.",
        duration: 3000,
        });
        return;
    }

    

    if (!isValidUrl(url)) {
        toast("Invalid URL", {
        description: `We'll need a valid URL, like "super-long-link.com/shorten-it"`,
        duration: 4000,
        });
        return;
    }

    router.push("/login");
    };

//add FORGOT PASSWORD LOGIC
  const goToLogin = () => router.push("/login");

  // const goToPricing = () => router.push("/pricing");
  // const goToSignup = () => router.push("/register");
  // const goToPricing = () => router.push("/pricing");

  return (
    <div className="min-h-screen w-full bg-linear-to-br from-white via-slate-100 to-slate-200 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-700 flex flex-col">
      {/* Header */}
        <Header />

      <div className="w-full border-b bg-amber-100 dark:bg-neutral-50 text-center text-sm text-neutral-600   py-3 px-4">
            <p className="max-w-4xl mx-auto leading-relaxed">
              This is a <span className="font-medium text-neutral-800">showcase version</span> of the{" "}
              <span className="font-semibold text-black">Shortly</span> project. The complete production build with
              advanced features is available at{" "}
              <a
                href="https://shortly.streamlab.in"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary dark:text-secondary font-medium underline underline-offset-2 hover:text-primary/80 transition-colors"
              >
                shortly.streamlab.in
              </a>.{" "}
              The source code for this demo is open on{" "}
              <a
                href="https://github.com/Partho-Mal/shortly-url-shortener-showcase"
                target="_blank"
                rel="noopener noreferrer"
                className="text-black dark:text-secondary font-medium underline underline-offset-2 hover:text-primary/80 transition-colors"
              >
                GitHub
              </a>. This version is intentionally lighter and designed for hiring
              managers to review the project’s core implementation.
            </p>
      </div>
      {/* <header className="sticky top-0 z-50 w-full backdrop-blur-sm bg-white/70 dark:bg-zinc-900/70 border-b border-slate-200 dark:border-zinc-700">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div
            onClick={() => router.push("/")}
            className="flex items-center space-x-2 cursor-pointer"
          >
            <Sparkles className="text-primary h-6 w-6" />
            <span className="text-xl font-bold text-slate-800 dark:text-white">
              Shortly
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-6">
            <button
              onClick={() => router.push("/landing")}
              className="text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-primary"
            >
              Home
            </button>
            <button
              onClick={goToPricing}
              className="text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-primary"
            >
              Pricing
            </button>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={goToLogin}>
              Sign In
            </Button>
            <Button onClick={goToSignup}>Sign Up</Button>
          </div>
        </div>
      </header> */}

      <main className="grow">
      

      {/* Hero Section */}
      <section className="w-full flex flex-col items-center justify-center px-4 py-16 text-center">
        <div className="max-w-2xl space-y-4">
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="inline w-8 h-8 text-primary mb-3"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
              <path d="M20 3v4" />
              <path d="M22 5h-4" />
              <path d="M4 17v2" />
              <path d="M5 18H3" />
            </svg>{" "}
            Free URL Shortener for Custom Links & QR Codes
          </h1>

          <section className="w-full flex flex-col items-center justify-center px-4 py-4 text-center">
          <div className="max-w-2xl space-y-4">

            <p className="text-lg text-slate-600 dark:text-slate-300">
              Create short links instantly with analytics, QR codes, and branded Custom Ending
            </p>

  
            <div className="w-full">
              <NoLoginShortenLinkForm />
            </div>
          </div>
        </section>
{/* 
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white">
            <Sparkles className="inline w-8 h-8 text-primary mb-3" />
            
            Free URL Shortener for Custom Links & QR Codes
          </h1> */}
            {/* Shorten Your Links with Style */}
          {/* <p className="text-lg text-slate-600 dark:text-slate-300">
            Create short links instantly with analytics, QR codes, and branded Custom Ending
          </p> */}

          {/* <div className="md:ml-[5rem] flex flex-col sm:flex-row items-center gap-2 w-full mt-8">
            <Input
              type="url"
              placeholder="Paste your long URL here..."
              className="w-full sm:w-96"
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleFakeShorten();
                }
              }}
            />
        
            <Button onClick={handleFakeShorten} 
            className="w-full sm:w-auto"
            >
              <div className="flex justify-center items-center">
              Shorten
              <MoveRight className="ml-2 mt-1 h-4 w-4" />
              </div>
            </Button>
          </div> */}

          <div className=" flex items-center justify-center gap-6 ">
          <Button
            // variant="link"
            onClick={goToLogin}
            className="mt-4 px-6 py-2 _rounded-xl font-medium text-white bg-linear-to-r from-fuchsia-500 via-violet-600 to-indigo-500 hover:brightness-95 hover:shadow-md transition duration-200"
            >
            <Link className="h-4 w-4" /> Login to manage your links
          </Button>

          {/* <Button
            // variant="link"
            onClick={goToPricing}
            className="mt-4 px-6 py-2 _rounded-xl font-medium text-white bg-linear-to-r from-fuchsia-500 via-violet-600 to-indigo-500 hover:brightness-95 hover:shadow-md transition duration-200 md:hidden "
            >
            <DollarSignIcon className="h-4 w-4" /> Pricing
          </Button> */}
            </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="mt-20 px-4 pb-16 w-full max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card className="text-center shadow-md dark:bg-zinc-800">
          <CardContent className="py-6">
            <ShieldCheck className="mx-auto h-8 w-8 text-primary mb-2" />
            <h3 className="text-xl font-semibold">Secure</h3>
            <p className="text-sm text-muted-foreground mt-2">
              All links are encrypted and protected from abuse.
            </p>
          </CardContent>
        </Card>

        <Card className="text-center shadow-md dark:bg-zinc-800">
          <CardContent className="py-6">
            <BarChart3 className="mx-auto h-8 w-8 text-primary mb-2" />
            <h3 className="text-xl font-semibold">Analytics</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Real-time link analytics including clicks, referrers, and devices — for every short URL.
              {/* Track clicks, referrals, and more in real-time. */}
            </p>
          </CardContent>
        </Card>

        <Card className="text-center shadow-md dark:bg-zinc-800">
          <CardContent className="py-6">
            <Clock className="mx-auto h-8 w-8 text-primary mb-2" />
            <h3 className="text-xl font-semibold">Fast & Reliable</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Fast and reliable URL redirection powered by secure infrastructure and caching.
              {/* Lightning-speed redirection with 99.9% uptime. */}
            </p>
          </CardContent>
        </Card>
      </section>

 
        {/* <section className="px-4 py-12 bg-white dark:bg-zinc-900"> */}
        <section className="grow">
        {/* Video component here */}
        <VideoPlayerSmart />
        </section>


      </main>
      <Footer/>
      <p className="text-center text-xs text-slate-500 dark:text-slate-400 mt-4 px-4">
        Shortly is a free online URL shortener tool to create short links with QR codes, click tracking, and custom slugs — ideal for social media, marketing, and business.
      </p>
    </div>
  );
}

