import { ContinueWatchingRow } from "@/components/continue-watching-row";
import { Hero } from "@/components/hero";
import { MediaRow } from "@/components/media-row";
import {
  getPopularMovies,
  getPopularTv,
  getTopRatedMovies,
  getTopRatedTv,
  getTrending,
  getUpcomingMovies,
  getNowPlayingMovies,
} from "@/lib/tmdb";

export const revalidate = 3600;

export default async function HomePage() {
  const [
    trending,
    popularMovies,
    popularTv,
    topMovies,
    topTv,
    upcomingMovies,
    nowPlayingMovies,
  ] = await Promise.all([
    getTrending(),
    getPopularMovies(),
    getPopularTv(),
    getTopRatedMovies(),
    getTopRatedTv(),
    getUpcomingMovies(),
    getNowPlayingMovies(),
  ]);

  const featured =
    trending.find((item) => item.backdropPath) ?? trending[0] ?? popularMovies.items[0];

  return (
    <div className="home">
      {featured ? <Hero media={featured} eyebrow="Trending this week" /> : null}

      <div className="home-rows">
        <ContinueWatchingRow />
        <MediaRow title="Trending now" items={trending.slice(0, 18)} />
        <MediaRow
          title="Movies"
          items={popularMovies.items}
          href="/movies"
          linkLabel="Browse movies"
        />
        <MediaRow
          title="TV shows"
          items={popularTv.items}
          href="/tv"
          linkLabel="Browse series"
        />
        <MediaRow
          title="Critically acclaimed films"
          items={topMovies.items}
          href="/movies?sort=top_rated"
          linkLabel="See more"
        />
        <MediaRow
          title="Top rated series"
          items={topTv.items}
          href="/tv?sort=top_rated"
          linkLabel="See more"
        />
        <MediaRow
          title="Upcoming"
          items={upcomingMovies.items}
          href="/movies?sort=upcoming"
          linkLabel="Browse upcoming"
        />
        <MediaRow
          title="Now playing"
          items={nowPlayingMovies.items}
          href="/movies?sort=now_playing"
          linkLabel="Browse releases"
        />
      </div>
    </div>
  );
}
