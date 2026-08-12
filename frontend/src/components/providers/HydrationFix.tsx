"use client";

import { useEffect, useState, ReactNode } from "react";

interface HydrationFixProps {
  children: ReactNode;
}

export function HydrationFix({ children }: HydrationFixProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Aggressive cleanup of bis_skin_checked attributes
    const cleanup = () => {
      try {
        document.querySelectorAll("[bis_skin_checked]").forEach((el) => {
          el.removeAttribute("bis_skin_checked");
        });
        // Also clean up any other extension-added attributes
        document.querySelectorAll("[data-rht-toaster]").forEach((el) => {
          if (el.hasAttribute("bis_skin_checked")) {
            el.removeAttribute("bis_skin_checked");
          }
        });
      } catch (e) {
        // Ignore errors
      }
    };

    // Run cleanup immediately
    cleanup();

    // Run cleanup after a short delay
    const timeoutIds: NodeJS.Timeout[] = [];
    [50, 100, 200, 500, 1000, 2000].forEach((delay) => {
      const id = setTimeout(cleanup, delay);
      timeoutIds.push(id);
    });

    // Use MutationObserver to watch for new elements
    let observer: MutationObserver | null = null;
    try {
      observer = new MutationObserver(() => {
        cleanup();
      });
      observer.observe(document.documentElement, {
        attributes: true,
        childList: true,
        subtree: true,
        attributeFilter: ["bis_skin_checked"],
      });
    } catch (e) {
      // Ignore errors
    }

    // Cleanup function
    return () => {
      timeoutIds.forEach((id) => clearTimeout(id));
      if (observer) {
        observer.disconnect();
      }
    };
  }, []);

  // Don't render children until mounted to avoid hydration mismatches
  if (!mounted) {
    return <div className="min-h-screen bg-[#0a0a0a]"></div>;
  }

  return <>{children}</>;
}
