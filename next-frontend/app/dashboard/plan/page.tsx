// app/dashboard/plan/page.tsx

/**
 * Displays plan information.
 * Since this is a showcase/demo, all users are on a free plan.
 */

"use client";

import { useEffect, useState } from "react";
import { Mail, CrownIcon } from "lucide-react";
import { apiFetch } from "@/utils/apiFetch";

const PlanPage = () => {
  const [email, setEmail] = useState("");

  useEffect(() => {
    const fetchUserDetails = async (): Promise<void> => {
      try {
        const data = await apiFetch(
          `${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_USER_DETAILS}`
        );
        setEmail(data?.email ?? "");
      } catch {
        // If fetch fails, default email remains empty
      }
    };

    fetchUserDetails();
  }, []);

  return (
    <section className="max-w-2xl mx-auto mt-10 px-4 text-center">
      <CrownIcon className="mx-auto h-10 w-10 text-green-500 mb-4" />

      <h1 className="text-2xl font-bold mb-2">You&apos;re on the Free Plan</h1>

      <p className="text-muted-foreground mb-4">
        All features currently available are free to use in this demo.
      </p>

      <p className="text-muted-foreground mb-4">
        This platform is a <strong>showcase/demo</strong> build. Some
        functionality may be simplified and intended to demonstrate technical
        and product ability.
      </p>

      {email && (
        <p className="text-muted-foreground mb-4">
          Logged in as: <strong>{email}</strong>
        </p>
      )}

      <p className="text-sm text-muted-foreground">
        If you’d like to discuss collaboration, production development, or work
        opportunities, feel free to reach out:
      </p>

      <p className="mt-2">
        <a
          href="mailto:parthoma7@gmail.com"
          className="text-blue-600 hover:underline"
        >
          parthoma7@gmail.com
        </a>
      </p>
    </section>
  );
};

export default PlanPage;
