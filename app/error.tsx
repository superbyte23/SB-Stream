"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="error-page">
      <div className="error-panel">
        <AlertTriangle size={40} aria-hidden="true" />
        <h1>Something interrupted the signal</h1>
        <p>
          The page could not be loaded. This is usually temporary — try again or head
          back to the homepage.
        </p>
        <div className="error-actions">
          <button type="button" className="btn btn-primary" onClick={reset}>
            <RefreshCw size={17} aria-hidden="true" />
            Try again
          </button>
          <a className="btn btn-secondary" href="/">
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}
