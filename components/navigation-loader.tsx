"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export function NavigationLoader() {
  const pathname = usePathname();
  const [active, setActive] = useState(false);

  useEffect(() => {
    setActive(true);
    const start = performance.now();
    const raf = requestAnimationFrame(() => {
      const elapsed = performance.now() - start;
      const remaining = Math.max(0, 220 - elapsed);
      const t = setTimeout(() => setActive(false), remaining);
      return () => clearTimeout(t);
    });
    return () => cancelAnimationFrame(raf);
  }, [pathname]);

  return <div className={`top-loader ${active ? "is-active" : ""}`} aria-hidden="true" />;
}
