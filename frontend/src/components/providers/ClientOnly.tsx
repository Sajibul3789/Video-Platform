"use client";

import { useEffect, useState, ReactNode } from "react";

interface ClientOnlyProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export function ClientOnly({ children, fallback = null }: ClientOnlyProps) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    // Clean up body attributes that might have been added by extensions
    const body = document.body;
    if (body) {
      const attrsToRemove = [
        "bis_register",
        "bis_skin_checked",
        "data-gramm",
        "data-gramm_editor",
        "data-new-gr-c-s-check-loaded",
        "data-gr-ext-installed",
        "__processed_",
      ];
      for (const attr of attrsToRemove) {
        if (body.hasAttribute(attr)) {
          body.removeAttribute(attr);
        }
        for (const bodyAttr of body.getAttributeNames()) {
          if (bodyAttr.includes(attr)) {
            body.removeAttribute(bodyAttr);
          }
        }
      }
    }
  }, []);

  if (!hasMounted) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
