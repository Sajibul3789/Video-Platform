import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ToastProvider } from "@/components/ui/Toast";
import Script from "next/script";

export const metadata: Metadata = {
  title: "VideoHub - Share and Discover Amazing Videos",
  description:
    "A modern video sharing platform where creators share amazing content with the world.",
  keywords:
    "video, sharing, platform, creators, content, watch, upload, community",
  authors: [{ name: "VideoHub" }],
  openGraph: {
    title: "VideoHub - Share and Discover Amazing Videos",
    description:
      "A modern video sharing platform where creators share amazing content with the world.",
    type: "website",
    url: "https://videohub.com",
    siteName: "VideoHub",
  },
  twitter: {
    card: "summary_large_image",
    title: "VideoHub - Share and Discover Amazing Videos",
    description:
      "A modern video sharing platform where creators share amazing content with the world.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: true,
  themeColor: "#0a0a0a",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        {/* Use Next.js Script component with proper placement */}
        <Script
          id="cleanup-bis-skin"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                if (typeof window !== 'undefined') {
                  const removeBisSkin = () => {
                    try {
                      document.querySelectorAll('[bis_skin_checked]').forEach(el => {
                        el.removeAttribute('bis_skin_checked');
                      });
                    } catch (e) {}
                  };
                  // Run immediately and on events
                  removeBisSkin();
                  document.addEventListener('DOMContentLoaded', removeBisSkin);
                  window.addEventListener('load', removeBisSkin);
                  // Run at intervals
                  [100, 300, 600, 1000, 2000].forEach(delay => {
                    setTimeout(removeBisSkin, delay);
                  });
                  // Use MutationObserver
                  if (window.MutationObserver) {
                    const observer = new MutationObserver(() => removeBisSkin());
                    observer.observe(document.documentElement, {
                      attributes: true,
                      childList: true,
                      subtree: true,
                      attributeFilter: ['bis_skin_checked']
                    });
                  }
                }
              })();
            `,
          }}
        />
      </head>
      <body suppressHydrationWarning>
        <div className="min-h-screen bg-[#0a0a0a]" suppressHydrationWarning>
          <ToastProvider />
          <Navbar />
          <main
            className="min-h-screen pt-4 pb-4 w-full"
            suppressHydrationWarning
          >
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
