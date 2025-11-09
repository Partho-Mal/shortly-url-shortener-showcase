// app/dashboard/support/page.tsx

/**
 * Displays support contact information for users needing assistance.
 */

import { Metadata } from "next";
import Link from "next/link";
import { Mail } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Support | Shortly",
  description: "Contact support or get help with Shortly",
};

export default function SupportPage() {
  return (
    <main className="min-h-screen w-full bg-linear-to-br from-white via-slate-100 to-slate-200 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-700 px-4 py-10">
      <div className="max-w-3xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-center">Support</h1>

        <p className="text-center text-muted-foreground">
          If you’d like to collaborate, need more work done, or have job opportunities - feel free to reach out.
        </p>

        <Card>
          <CardHeader>
            <CardTitle>Contact</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4 text-sm">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-blue-600" />
              <Link
                href="mailto:parthoma7@gmail.com"
                className="text-blue-600 hover:underline"
              >
                parthoma7@gmail.com
              </Link>
            </div>

            <p className="text-muted-foreground">
              Open to freelance work, long-term projects, and full-time roles.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
