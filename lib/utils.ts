import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number, currency = "USD"): string {
  const rates: Record<string, number> = { USD: 1, EUR: 0.92, GBP: 0.79 };
  const symbols: Record<string, string> = { USD: "$", EUR: "€", GBP: "£" };
  const converted = price * (rates[currency] || 1);
  return `${symbols[currency] || "$"}${converted.toFixed(2)}`;
}

export function formatDiscount(percent: number): string {
  return `-${percent}%`;
}

export function generateSlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function getDiscountedPrice(price: number, discountPercent: number): number {
  return price * (1 - discountPercent / 100);
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength).trim() + "...";
}

export function getStarsArray(rating: number): ("full" | "half" | "empty")[] {
  const stars: ("full" | "half" | "empty")[] = [];
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) stars.push("full");
    else if (rating >= i - 0.5) stars.push("half");
    else stars.push("empty");
  }
  return stars;
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });
}

export function getEstimatedDelivery(days = 5): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
}
