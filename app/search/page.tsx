import type { Metadata } from "next";
import Link from "next/link";
import { Search } from "lucide-react";
import { MediaGrid } from "@/components/media-grid";
import { Pagination } from "@/components/pagination";
import { SearchBox } from "@/components/search-box";
import { getTrending, searchTitles } from "@/lib/tmdb";
import { clamp } from "@/lib/utils";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const params = await searchParams;
  const query = first(params.q)?.trim();

  return {
    title: query ? `Search: ${query}` : "Search",
    description: query
      ? `Search results for ${query} across the 1FLEX movie and TV catalogue.`
      : "Search the 1FLEX catalogue for movies and TV shows.",
    alternates: { canonical: "/search" },
    robots: { index: false, follow: true },
  };
}

export default async function SearchPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const query = first(params.q)?.trim() ?? "";
  const requestedPage = Number.parseInt(first(params.page) ?? "1", 10);
  const page = clamp(Number.isFinite(requestedPage) ? requestedPage : 1, 1, 500);

  const data = query ? await searchTitles(query, page) : null;
  const suggestions = query ? [] : (await getTrending()).slice(0, 18);

  return (
    <div className="browse-page search-page">
      <header className="page-head search-head">
        <div className="page-head-copy">
          <p className="page-eyebrow">Search</p>
          <h1>
            {query ? (
              <>
                Results for <span className="search-term">“{query}”</span>
              </>
            ) : (
              "Find something to watch"
            )}
          </h1>
          <p>
            {query
              ? `${data?.totalResults ?? 0} matching titles in the catalogue.`
              : "Search across movies and TV shows, then pick a server and press play."}
          </p>
        </div>
      </header>

      <div className="page-search-wrap">
        <SearchBox className="page-search" autoFocus placeholder="Search movies and TV shows" />
      </div>

      {query ? (
        data && data.items.length > 0 ? (
          <>
            <MediaGrid items={data.items} />
            <Pagination
              page={data.page}
              totalPages={data.totalPages}
              basePath="/search"
              query={{ q: query }}
            />
          </>
        ) : (
          <div className="search-empty">
            <Search size={30} aria-hidden="true" />
            <h2>No matches found</h2>
            <p>
              Nothing matched “{query}”. Try a shorter title, a different spelling, or
              browse the full catalogue.
            </p>
            <div className="search-empty-actions">
              <Link className="btn btn-secondary" href="/movies">
                Browse movies
              </Link>
              <Link className="btn btn-secondary" href="/tv">
                Browse TV
              </Link>
            </div>
          </div>
        )
      ) : (
        <section className="search-suggestions" aria-labelledby="trending-search-heading">
          <div className="section-head">
            <h2 id="trending-search-heading">Trending now</h2>
          </div>
          <MediaGrid items={suggestions} />
        </section>
      )}
    </div>
  );
}
