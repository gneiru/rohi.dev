import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import djs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

djs.extend(relativeTime);

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const dayjs = djs;

export function generateImage({ title, date }: { date?: Date; title: string }) {
  const postDate = date
    ? date.toLocaleDateString("en-us", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "";
  return `https://og.rohi.dev/blog?date=${postDate}&title=${title}`;
}
