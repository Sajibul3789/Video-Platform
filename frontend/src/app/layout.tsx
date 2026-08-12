import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { Footer } from "@/components/layout/Footer";
import { ToastProvider } from "@/components/ui/Toast";
import { HydrationFix } from "@/components/providers/HydrationFix";

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
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                if (typeof window !== 'undefined') {
                  const removeBisSkin = function() {
                    try {
                      document.querySelectorAll('[bis_skin_checked]').forEach(function(el) {
                        el.removeAttribute('bis_skin_checked');
                      });
                    } catch(e) {}
                  };
                  removeBisSkin();
                  if (document.readyState === 'loading') {
                    document.addEventListener('DOMContentLoaded', removeBisSkin);
                  }
                  window.addEventListener('load', removeBisSkin);
                  setTimeout(removeBisSkin, 100);
                  setTimeout(removeBisSkin, 500);
                }
              })();
            `,
          }}
        />
      </head>
      <body suppressHydrationWarning>
        <HydrationFix>
          <div
            className="min-h-screen bg-[#0a0a0a] w-full pb-16 lg:pb-0"
            suppressHydrationWarning
          >
            <ToastProvider />
            <Navbar />
            <div className="flex w-full" suppressHydrationWarning>
              {/* Left Sidebar - Desktop only */}
              <aside
                className="hidden lg:block w-[240px] xl:w-[280px] flex-shrink-0 px-4 pt-4"
                suppressHydrationWarning
              >
                <Sidebar />
              </aside>

              {/* Main Content */}
              <main
                className="flex-1 min-h-screen w-full lg:w-auto overflow-x-hidden"
                suppressHydrationWarning
              >
                {children}
              </main>
            </div>
            <Footer />

            {/* Mobile Bottom Navigation - Mobile only */}
            <MobileBottomNav />
          </div>
        </HydrationFix>
      </body>
    </html>
  );
}
