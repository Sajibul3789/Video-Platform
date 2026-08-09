import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ToastProvider } from "@/components/ui/Toast";

export const metadata: Metadata = {
  title: "VideoHub - Share and Discover Videos",
  description: "A professional video sharing platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ToastProvider />
        <Navbar />
        <main className="min-h-screen bg-[#f0f2f5] dark:bg-gray-950">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
