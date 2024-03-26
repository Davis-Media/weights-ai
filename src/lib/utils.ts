import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { customAlphabet } from "nanoid";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const nanoid = customAlphabet("0123456789abcdefghijklmnopqrstuvwxyz", 10);

/**
 * Generates a random ID with a specified length.
 *
 * @param length - The desired length of the ID (default is 10).
 * @returns A random ID string.
 */
export function generateId(length = 10): string {
  return nanoid();
}
