// components/providers/ThemeProvider.tsx

/**
 * Wraps the Next.js theme provider.
 * Enables light/dark theme preference handling across the application.
 */

"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
