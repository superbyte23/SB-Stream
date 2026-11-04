"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { Loader2, Search, X } from "lucide-react";
import { tmdbImage } from "@/lib/images";
import type { Media } from "@/lib/types";
import { cn, formatRating, gradientFor, initials } from "@/lib/utils";

interface SearchBoxProps {
  className?: string;
  onNavigate?: () => void;
  autoFocus?: boolean;
  placeholder?: string;
}

export function SearchBox({
  className,
  onNavigate,
  autoFocus = false,
  placeholder = "Search titles",
}: SearchBoxProps) {
  const router = useRouter();
  const listId = useId();
  const rootRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Media[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    const term = query.trim();

    if (term.length < 2) {
      setResults([]);
      setLoading(false);
      setActiveIndex(-1);
      return;
    }

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(term)}`, {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error(`Search failed: ${response.status}`);
        const data = (await response.json()) as { results?: Media[] };
        setResults(Array.isArray(data.results) ? data.results.slice(0, 6) : []);
        setOpen(true);
        setActiveIndex(-1);
      } catch {
        if (!controller.signal.aborted) {
          setResults([]);
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 250);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  useEffect(() => {
    const handlePointer = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
        setActiveIndex(-1);
      }
    };

    document.addEventListener("pointerdown", handlePointer);
    return () => document.removeEventListener("pointerdown", handlePointer);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const goToTitle = (item: Media) => {
    setOpen(false);
    setActiveIndex(-1);
    setQuery("");
    onNavigate?.();
    router.push(`/title/${item.type}/${item.id}`);
  };

  const submit = () => {
    const term = query.trim();
    if (!term) return;
    setOpen(false);
    onNavigate?.();
    inputRef.current?.blur();
    router.push(`/search?q=${encodeURIComponent(term)}`);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (!open) {
        setOpen(true);
        return;
      }
      setActiveIndex((index) => Math.min(index + 1, results.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => Math.max(index - 1, -1));
    } else if (event.key === "Enter") {
      event.preventDefault();
      if (open && activeIndex >= 0 && results[activeIndex]) {
        goToTitle(results[activeIndex]);
      } else {
        submit();
      }
    } else if (event.key === "Escape") {
      setOpen(false);
      setActiveIndex(-1);
    }
  };

  const showPanel = open && (loading || results.length > 0 || query.trim().length >= 2);

  return (
    <form
      ref={rootRef}
      className={cn("search-box", className)}
      role="search"
      onSubmit={(event) => {
        event.preventDefault();
        submit();
      }}
    >
      <Search size={16} className="search-icon" aria-hidden="true" />
      <input
        ref={inputRef}
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
          setOpen(true);
        }}
        onFocus={() => {
          if (query.trim().length >= 2) setOpen(true);
        }}
        onKeyDown={onKeyDown}
        type="search"
        role="combobox"
        aria-label="Search movies and TV shows"
        aria-expanded={showPanel}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={
          activeIndex >= 0 ? `${listId}-option-${activeIndex}` : undefined
        }
        placeholder={placeholder}
        autoComplete="off"
        autoFocus={autoFocus}
        spellCheck={false}
      />

      {query ? (
        <button
          type="button"
          className="search-clear"
          aria-label="Clear search"
          onClick={() => {
            setQuery("");
            setResults([]);
            setOpen(false);
            inputRef.current?.focus();
          }}
        >
          <X size={14} />
        </button>
      ) : (
        <kbd className="search-kbd" aria-hidden="true">
          ⌘K
        </kbd>
      )}

      {showPanel ? (
        <div className="search-panel" id={listId} role="listbox">
          {loading && results.length === 0 ? (
            <div className="search-status">
              <Loader2 size={15} className="spin" aria-hidden="true" />
              Searching the catalogue…
            </div>
          ) : null}

          {!loading && results.length === 0 && query.trim().length >= 2 ? (
            <div className="search-status">
              No matches for <strong>{query.trim()}</strong>
            </div>
          ) : null}

          {results.map((item, index) => {
            const image = tmdbImage(item.posterPath, "w185");
            return (
              <button
                key={`${item.type}-${item.id}`}
                type="button"
                id={`${listId}-option-${index}`}
                role="option"
                aria-selected={index === activeIndex}
                className={cn("search-result", index === activeIndex && "is-active")}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => goToTitle(item)}
              >
                <span className="search-thumb">
                  {image ? (
                    <Image src={image} alt="" fill sizes="44px" />
                  ) : (
                    <span
                      className="search-thumb-fallback"
                      style={{ background: gradientFor(item.hue) }}
                      aria-hidden="true"
                    >
                      {initials(item.title)}
                    </span>
                  )}
                </span>
                <span className="search-result-copy">
                  <span className="search-result-title">{item.title}</span>
                  <span className="search-result-meta">
                    {item.type === "tv" ? "Series" : "Film"}
                    {item.year ? ` · ${item.year}` : ""}
                    {item.rating ? ` · ★ ${formatRating(item.rating)}` : ""}
                  </span>
                </span>
              </button>
            );
          })}

          {results.length > 0 ? (
            <button type="button" className="search-all" onClick={submit}>
              See all results for “{query.trim()}”
            </button>
          ) : null}
        </div>
      ) : null}
    </form>
  );
}
