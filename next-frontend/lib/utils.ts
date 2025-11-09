// lib/utils.ts

/**
 * Utility helpers for merging Tailwind + conditional class names.
 *
 * `cn()` merges class names using:
 *   - `clsx` for conditional class name evaluation
 *   - `tailwind-merge` for removing conflicting Tailwind classes
 *
 * This ensures:
 *   - predictable class override behavior
 *   - clean conditional class composition
 */

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines multiple class inputs into a deduplicated Tailwind-safe string.
 *
 * @param inputs - One or more class name expressions.
 * @returns A merged Tailwind-compatible class string.
 *
 * @example
 *   cn("px-2", isActive && "text-primary", "px-4");
 *   → "text-primary px-4"
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
