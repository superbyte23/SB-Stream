"use client";

import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface SeasonSelectProps {
  seasons: number[];
  current: number;
  tvId?: number;
  mode?: "details" | "watch";
}

export function SeasonSelect({
  seasons,
  current,
  tvId,
  mode = "details",
}: SeasonSelectProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();

  return (
    <label className={cn("season-select", pending && "is-pending")}>
      <span>Season</span>
      <span className="season-select-control">
        <select
          value={current}
          disabled={pending || seasons.length <= 1}
          aria-label="Choose a season"
          onChange={(event) => {
            const value = event.target.value;
            const target =
              mode === "watch" && tvId
                ? `/watch/tv/${tvId}/${value}/1`
                : `${pathname}?season=${value}`;
            startTransition(() => {
              router.push(target, { scroll: false });
            });
          }}
        >
          {seasons.map((season) => (
            <option value={season} key={season}>
              Season {season}
            </option>
          ))}
        </select>
        <ChevronDown size={15} aria-hidden="true" />
      </span>
    </label>
  );
}
