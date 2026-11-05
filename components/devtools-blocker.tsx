"use client";

import { useEffect } from "react";

export function DevToolsBlocker() {
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "F12") e.preventDefault();
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "i") e.preventDefault();
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "c") e.preventDefault();
      if (e.ctrlKey && e.key.toLowerCase() === "u") e.preventDefault();
      if (e.metaKey && e.key.toLowerCase() === "i") e.preventDefault();
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);

    // Devtools detection - remove content if open
    let blocked = false;
    const checkDevtools = () => {
      const threshold = 160;
      const widthDiff = window.outerWidth - window.innerWidth;
      const heightDiff = window.outerHeight - window.innerHeight;
      const isOpen = widthDiff > threshold || heightDiff > threshold;
      if (isOpen && !blocked) {
        blocked = true;
        document.body.innerHTML = '<div style="height:100vh;background:#0a0a0b"></div>';
      }
    };
    const interval = setInterval(checkDevtools, 500);
    checkDevtools();

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
      clearInterval(interval);
    };
  }, []);

  return null;
}
