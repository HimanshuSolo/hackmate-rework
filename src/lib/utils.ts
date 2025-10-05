import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function extractFormSubmitErrorMessages(errors: any): string[] {
  let messages: string[] = [];

  for (const key in errors) {
    if (!errors.hasOwnProperty(key)) continue;

    const err = errors[key];

    if (err?.message) {
      messages.push(err.message);
    }

    // Handle nested objects, e.g., startupInfo.goals
    if (typeof err === "object" && err !== null) {
      messages = messages.concat(extractFormSubmitErrorMessages(err));
    }
  }

  return messages;
}
