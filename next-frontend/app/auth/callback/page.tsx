// app/auth/callback/page.tsx

/**
 * Wraps the authentication callback client component in React Suspense.
 * The child component handles token processing and redirects.
 */

import { Suspense } from "react";
import AuthCallbackClient from "./AuthCallbackClient";

export default function Page() {
  return (
    <Suspense>
      <AuthCallbackClient />
    </Suspense>
  );
}
