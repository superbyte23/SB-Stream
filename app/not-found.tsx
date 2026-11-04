import Link from "next/link";
import { Home, Search, Tv } from "lucide-react";

export default function NotFound() {
  return (
    <div className="not-found">
      <p className="not-found-code">404</p>
      <h1>This title is off the air</h1>
      <p>
        The page you were looking for does not exist, or the title is no longer in the
        catalogue.
      </p>
      <div className="not-found-actions">
        <Link className="btn btn-primary" href="/">
          <Home size={17} aria-hidden="true" />
          Back home
        </Link>
        <Link className="btn btn-secondary" href="/movies">
          <Tv size={17} aria-hidden="true" />
          Browse movies
        </Link>
        <Link className="btn btn-secondary" href="/search">
          <Search size={17} aria-hidden="true" />
          Search
        </Link>
      </div>
    </div>
  );
}
