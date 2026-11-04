"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Bookmark, X } from "lucide-react";
import { MediaCard } from "./media-card";
import {
  readWatchlist,
  toggleWatchlist,
  WATCHLIST_EVENT,
  type WatchlistEntry,
} from "@/lib/storage";

export function MyListView() {
  const [items, setItems] = useState<WatchlistEntry[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const sync = () => setItems(readWatchlist());
    sync();
    setMounted(true);
    window.addEventListener(WATCHLIST_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(WATCHLIST_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return (
    <div className="browse-page my-list-page">
      <header className="page-head">
        <div className="page-head-copy">
          <p className="page-eyebrow">Saved</p>
          <h1>My List</h1>
          <p>
            {mounted && items.length
              ? `${items.length} ${items.length === 1 ? "title" : "titles"} saved in this browser.`
              : "Save films and series to find them again quickly."}
          </p>
        </div>
      </header>

      {!mounted ? null : items.length ? (
        <div className="media-grid watchlist-grid">
          {items.map((item) => (
            <article className="watchlist-item" key={`${item.type}-${item.id}`}>
              <MediaCard
                media={item}
                sizes="(max-width: 520px) 44vw, (max-width: 900px) 22vw, 190px"
              />
              <button
                type="button"
                className="watchlist-remove"
                aria-label={`Remove ${item.title} from My List`}
                onClick={() => {
                  toggleWatchlist(item);
                  setItems(readWatchlist());
                }}
              >
                <X size={14} />
              </button>
            </article>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <Bookmark size={32} aria-hidden="true" />
          <h2>Your list is empty</h2>
          <p>Open any title and choose “My List” to keep it here for later.</p>
          <div className="empty-actions">
            <Link className="btn btn-primary" href="/movies">
              Browse movies
            </Link>
            <Link className="btn btn-secondary" href="/tv">
              Browse TV shows
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
