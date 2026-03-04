"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export function NavigationProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const url = useRef(pathname + searchParams.toString());

  // Navigation completed — hide bar
  useEffect(() => {
    const next = pathname + searchParams.toString();
    if (url.current !== next) {
      url.current = next;
      setLoading(false);
    }
  }, [pathname, searchParams]);

  // Listen for clicks on internal links to start the bar
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const anchor = (e.target as HTMLElement).closest("a");
      if (!anchor) return;
      if (anchor.target === "_blank" || anchor.hasAttribute("download")) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("http") || href.startsWith("#") || href.startsWith("mailto:"))
        return;

      // Don't show for same-page links
      if (href === pathname) return;

      setLoading(true);
    }

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [pathname]);

  if (!loading) return null;

  return <div className="nav-progress" />;
}
