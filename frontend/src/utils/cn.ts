import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines class names using clsx and merges Tailwind conflicts using twMerge.
 * 
 * Example:
 * cn("px-4", isActive && "bg-blue-500", "px-2") // → "bg-blue-500 px-2"
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(...inputs));
}

// If using TypeScript, import this type for better hints
import type { ClassValue } from "clsx";
