// app/dashboard/support/page.tsx

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
    <main className="min-h-screen w-full bg-gradient-to-br from-white via-slate-100 to-slate-200 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-700 px-4 py-10">
      <div className="max-w-3xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-center">Support</h1>
        <p className="text-center text-muted-foreground">
          If you need help or have any questions about using Shortly, feel free to reach out.
        </p>

        <Card>
          <CardHeader>
            <CardTitle>Contact Options</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-blue-600" />
              <Link
                href="https://mail.google.com/mail/?view=cm&fs=1&to=support@streamlab.in&su=Support%20Request&body=Hi%20team,"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                support@streamlab.in
              </Link>
            </div>

            {/* <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-green-600" />
              <Link
                href="https://streamlab.in"
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-700 hover:underline"
              >
                Streamlab
              </Link>
            </div> */}

            {/* <div className="flex items-center gap-3">
              <MessageCircle className="w-5 h-5 text-purple-600" />
              <span className="font-mono">Discord: streamlab_dev</span>
            </div> */}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
