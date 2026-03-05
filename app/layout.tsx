import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { ToastProvider } from "@/components/ToastProvider";
import { QueryProvider } from "@/components/QueryProvider";
import { KonamiListener } from "@/components/KonamiListener";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: {
    default: "StyleAI — Discover Fashion with AI",
    template: "%s | StyleAI",
  },
  description: "AI-powered fashion platform with personalized recommendations. Shop the latest trends in men's, women's, kids, shoes and accessories.",
  keywords: ["fashion", "e-commerce", "AI recommendations", "clothing", "shoes", "accessories"],
  openGraph: {
    title: "StyleAI — Discover Fashion with AI",
    description: "AI-powered fashion platform with personalized recommendations.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "StyleAI — Discover Fashion with AI",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-background font-sans antialiased">
        <QueryProvider>
          <ToastProvider>
            <Header />
            <main className="min-h-screen">{children}</main>
            <Footer />
            <CartDrawer />
            <KonamiListener />
          </ToastProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
