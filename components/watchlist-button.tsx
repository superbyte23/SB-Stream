"use client";

import { useEffect, useState } from "react";
import { Check, Plus } from "lucide-react";
import type { Media } from "@/lib/types";
import { isInWatchlist, toggleWatchlist, WATCHLIST_EVENT } from "@/lib/storage";
import { cn } from "@/lib/utils";

interface WatchlistButtonProps {
  media: Media;
  className?: string;
  compact?: boolean;
}

export function WatchlistButton({ media, className, compact = false }: WatchlistButtonProps) {
  const [saved, setSaved] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const sync = () => setSaved(isInWatchlist(media.type, media.id));
    sync();
    setMounted(true);
    window.addEventListener(WATCHLIST_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(WATCHLIST_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, [media.id, media.type]);

  const label = saved ? "In My List" : "My List";

  return (
    <button
      type="button"
      className={cn(
        "btn btn-secondary watchlist-button",
        compact && "is-compact",
        saved && "is-saved",
        className,
      )}
      onClick={() => setSaved(toggleWatchlist(media))}
      aria-pressed={mounted ? saved : undefined}
      aria-label={compact ? label : undefined}
    >
      {saved ? <Check size={18} aria-hidden="true" /> : <Plus size={18} aria-hidden="true" />}
      {compact ? <span className="sr-only">{label}</span> : <span>{label}</span>}
    </button>
  );
}
