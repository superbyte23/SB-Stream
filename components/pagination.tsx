import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  page: number;
  totalPages: number;
  basePath: string;
  query?: Record<string, string | undefined>;
}

export function Pagination({ page, totalPages, basePath, query }: PaginationProps) {
  if (totalPages <= 1) return null;

  const hrefFor = (target: number) => {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(query ?? {})) {
      if (value && key !== "page") params.set(key, value);
    }
    if (target > 1) params.set("page", String(target));
    const search = params.toString();
    return search ? `${basePath}?${search}` : basePath;
  };

  return (
    <nav className="pagination" aria-label="Pagination">
      {page > 1 ? (
        <Link className="page-button" href={hrefFor(page - 1)} rel="prev">
          <ChevronLeft size={16} aria-hidden="true" />
          Previous
        </Link>
      ) : (
        <span className="page-button is-disabled" aria-disabled="true">
          <ChevronLeft size={16} aria-hidden="true" />
          Previous
        </span>
      )}

      <span className="page-status">
        Page {page} of {totalPages}
      </span>

      {page < totalPages ? (
        <Link className="page-button" href={hrefFor(page + 1)} rel="next">
          Next
          <ChevronRight size={16} aria-hidden="true" />
        </Link>
      ) : (
        <span className="page-button is-disabled" aria-disabled="true">
          Next
          <ChevronRight size={16} aria-hidden="true" />
        </span>
      )}
    </nav>
  );
}
