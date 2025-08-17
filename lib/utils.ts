import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a date in a TikTok-like style.
 * Examples:
 *   - "2h ago" for hours ago
 *   - "3d ago" for days ago
 *   - "Mar 5" for dates in the current year
 *   - "Mar 5, 2023" for previous years
 *
 * @param inputDate - The date to format (Date or string)
 * @returns {string} - The formatted date string
 */
export function formatDate(inputDate: Date | string): string {
  // Security: Validate and sanitize input
  const date = inputDate instanceof Date ? inputDate : new Date(inputDate);
  if (isNaN(date.getTime())) return "";

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  // Less than 1 minute ago
  if (diffSec < 60) return "just now";
  // Less than 1 hour ago
  if (diffMin < 60) return `${diffMin}m ago`;
  // Less than 24 hours ago
  if (diffHr < 24) return `${diffHr}h ago`;
  // Less than 7 days ago
  if (diffDay < 7) return `${diffDay}d ago`;

  // For dates in the current year, show "Mon D"
  // For previous years, show "Mon D, YYYY"
  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
  };
  if (date.getFullYear() !== now.getFullYear()) {
    options.year = "numeric";
  }
  return date.toLocaleDateString("en-US", options);
}

export const APP_URL =
  process.env.NEXT_PUBLIC_URL || "https://Outfitly.vercel.app";
