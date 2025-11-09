"use client";

import { useEffect, useState } from "react";
// import { Badge } from "@/components/ui/badge";
import { Mail, CrownIcon} from "lucide-react";
import { apiFetch } from "@/utils/apiFetch";
// import { cn } from "@/lib/utils";

// const getPlanBadgeStyle = (plan: string) => {
//   switch (plan.toLowerCase()) {
//     case "free":
//       return "bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-300 border border-red-200 dark:border-red-400/30 shadow-sm"

//     case "pro":
//       return "relative bg-gradient-to-tr from-indigo-500 via-indigo-600 to-indigo-700 text-white font-semibold shadow-md ring-1 ring-indigo-400/30 dark:ring-indigo-500/20 after:content-['✨'] after:absolute after:-top-1 after:-right-2 after:animate-ping after:text-white/70 dark:after:text-indigo-300/50"

//     case "enterprise":
//       return "relative bg-gradient-to-br from-neutral-900/90 to-neutral-800 dark:from-white/5 dark:to-white/10 text-white dark:text-yellow-200 font-bold border border-white/10 shadow-lg backdrop-blur-md after:content-['👑'] after:absolute after:-top-1 after:-right-2 after:animate-bounce after:text-yellow-400/90"

//     default:
//       return "bg-neutral-300 text-black dark:bg-neutral-700 dark:text-white border border-neutral-400 dark:border-neutral-600"
//   }
// }

const PlanPage = () => {
  const [plan, setPlan] = useState("free");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const data = await apiFetch(
          `${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_USER_DETAILS}`
        );
        setPlan(data?.plan || "free");
        setEmail(data?.email || "");
      } catch (error) {
        console.error("Failed to fetch user details", error);
      }
    };

    fetchUserDetails();
  }, []);

  return (
    <section className="max-w-2xl mx-auto mt-10 px-4 text-center">
      {/* <div className="mb-6">
        <Badge className={cn("text-sm px-3 py-1 rounded-full", getPlanBadgeStyle(plan))}>
          {plan.toUpperCase()}
        </Badge>
      </div> */}

      {plan === "enterprise" ? (
        <>
          {/* <ShieldCheck className="mx-auto h-10 w-10 text-yellow-400 mb-4" /> */}
          <CrownIcon className="mx-auto h-10 w-10 text-yellow-400 mb-4" />
          <h1 className="text-2xl font-bold mb-2">You&apos;re on the Enterprise plan 🎉</h1>
          <p className="text-muted-foreground">Thank you for being one of our top-tier users. You have access to everything we offer. If you need anything, reach out to your dedicated account manager or support@streamlab.in.</p>
        </>
      ) : (
        <>
          <Mail className="mx-auto h-10 w-10 text-blue-500 mb-4" />
          <h1 className="text-2xl font-bold mb-2">
            Want to upgrade your <span className="capitalize">{plan}</span> plan?
          </h1>
          <p className="text-muted-foreground mb-4">
            <span>
                Email us at <strong>support@streamlab.in</strong> with your account email <strong>{email}</strong>
            </span>
            <div className="sm:mt-5 md:mt-1">
                We&apos;ll send you offers and pricing.
            </div>
          </p>

          {plan === "free" && (
            <p className="text-sm text-muted-foreground">
              Upgrading unlocks ads free faster redirects and more.
            </p>
          )}
          {plan === "pro" && (
            <p className="text-sm text-muted-foreground">
              Enterprise gives you premium integrations, priority support, and custom solutions.
            </p>
          )}
        </>
      )}
    </section>
  );
};

export default PlanPage;
