import { MediaCard } from "./media-card";
import type { Media } from "@/lib/types";

interface MediaGridProps {
  items: Media[];
}

export function MediaGrid({ items }: MediaGridProps) {
  return (
    <div className="media-grid">
      {items.map((item) => (
        <MediaCard
          key={`${item.type}-${item.id}`}
          media={item}
          sizes="(max-width: 520px) 44vw, (max-width: 900px) 22vw, 190px"
        />
      ))}
    </div>
  );
}
