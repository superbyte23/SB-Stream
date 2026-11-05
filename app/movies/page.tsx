import type { Metadata } from "next";
import Link from "next/link";
import { MediaGrid } from "@/components/media-grid";
import { Pagination } from "@/components/pagination";
import { getPopularMovies, getTopRatedMovies } from "@/lib/tmdb";
import { clamp } from "@/lib/utils";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Movies",
  description:
    "Browse popular movies and critically acclaimed films, then stream instantly.",
  alternates: { canonical: "/movies" },
};

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function MoviesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const sort = first(params.sort) === "top_rated" ? "top_rated" : "popular";
  const requestedPage = Number.parseInt(first(params.page) ?? "1", 10);
  const page = clamp(Number.isFinite(requestedPage) ? requestedPage : 1, 1, 500);

  const data =
    sort === "top_rated" ? await getTopRatedMovies(page) : await getPopularMovies(page);

  return (
    <div className="browse-page">
      <header className="page-head">
        <div className="page-head-copy">
          <p className="page-eyebrow">Catalogue</p>
          <h1>Movies</h1>
          <p>Big releases and enduring favourites, ready to watch.</p>
        </div>

        <div className="sort-tabs" aria-label="Sort movies">
          <Link
            href="/movies"
            className={sort === "popular" ? "is-active" : undefined}
            aria-current={sort === "popular" ? "page" : undefined}
          >
            Popular
          </Link>
          <Link
            href="/movies?sort=top_rated"
            className={sort === "top_rated" ? "is-active" : undefined}
            aria-current={sort === "top_rated" ? "page" : undefined}
          >
            Top rated
          </Link>
        </div>
      </header>

      {data.items.length ? (
        <MediaGrid items={data.items} />
      ) : (
        <p className="empty-note">
          No movies were returned for this page. <Link href="/movies">Start over</Link>.
        </p>
      )}

      <Pagination
        page={data.page}
        totalPages={data.totalPages}
        basePath="/movies"
        query={{ sort: sort === "top_rated" ? "top_rated" : undefined }}
      />
    </div>
  );
}
