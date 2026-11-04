"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { MediaCard } from "./media-card";
import type { Media } from "@/lib/types";
import { cn } from "@/lib/utils";

interface MediaRowProps {
  title: string;
  items: Media[];
  href?: string;
  linkLabel?: string;
  orientation?: "poster" | "wide";
  className?: string;
}

export function MediaRow({
  title,
  items,
  href,
  linkLabel = "View all",
  orientation = "poster",
  className,
}: MediaRowProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  const update = useCallback(() => {
    const node = scrollerRef.current;
    if (!node) return;
    setCanLeft(node.scrollLeft > 8);
    setCanRight(node.scrollLeft + node.clientWidth < node.scrollWidth - 8);
  }, []);

  useEffect(() => {
    const node = scrollerRef.current;
    if (!node) return;

    update();
    const observer = new ResizeObserver(update);
    observer.observe(node);
    window.addEventListener("resize", update);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", update);
    };
  }, [items.length, update]);

  const scroll = (direction: -1 | 1) => {
    const node = scrollerRef.current;
    if (!node) return;
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    node.scrollBy({
      left: direction * Math.max(node.clientWidth * 0.82, 300),
      behavior: reduced ? "auto" : "smooth",
    });
  };

  if (!items.length) return null;

  return (
    <section className={cn("media-section", className)} aria-labelledby={`row-${slug(title)}`}>
      <div className="section-head">
        <h2 id={`row-${slug(title)}`}>{title}</h2>
        {href ? (
          <Link className="view-all" href={href}>
            {linkLabel}
            <ChevronRight size={14} aria-hidden="true" />
          </Link>
        ) : null}
      </div>

      <div className="row-shell">
        <button
          type="button"
          className={cn("row-arrow left", canLeft && "is-visible")}
          onClick={() => scroll(-1)}
          aria-label={`Scroll ${title} left`}
          tabIndex={canLeft ? 0 : -1}
          aria-hidden={!canLeft}
        >
          <ChevronLeft size={26} />
        </button>

        <div
          className={cn("row-scroller", orientation === "wide" && "is-wide")}
          ref={scrollerRef}
          onScroll={update}
        >
          {items.map((item) => (
            <MediaCard
              key={`${item.type}-${item.id}`}
              media={item}
              orientation={orientation}
              sizes={
                orientation === "wide"
                  ? "(max-width: 640px) 220px, 300px"
                  : "(max-width: 640px) 122px, 166px"
              }
            />
          ))}
        </div>

        <button
          type="button"
          className={cn("row-arrow right", canRight && "is-visible")}
          onClick={() => scroll(1)}
          aria-label={`Scroll ${title} right`}
          tabIndex={canRight ? 0 : -1}
          aria-hidden={!canRight}
        >
          <ChevronRight size={26} />
        </button>
      </div>
    </section>
  );
}

function slug(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
