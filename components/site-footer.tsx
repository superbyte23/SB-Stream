import Link from "next/link";
import { siteName } from "@/lib/site";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <Link className="logo footer-logo" href="/" aria-label="SB Stream home">
            SB Stream
          </Link>
          <p className="footer-disclaimer">
            SB Stream is a catalogue and discovery interface. We do not host, upload, or
            store any video content. Playback is supplied by third-party embed
            providers; all media rights belong to their respective owners.
          </p>
          <p className="footer-attribution">
            This product uses the{" "}
            <a href="https://www.themoviedb.org/" target="_blank" rel="noopener noreferrer">
              TMDB API
            </a>{" "}
            but is not endorsed or certified by TMDB.
          </p>
        </div>

        <nav className="footer-column" aria-label="Browse">
          <h2>Browse</h2>
          <Link href="/">Home</Link>
          <Link href="/movies">Movies</Link>
          <Link href="/tv">TV Shows</Link>
          <Link href="/my-list">My List</Link>
        </nav>

        <nav className="footer-column" aria-label="Information">
          <h2>Information</h2>
          <Link href="/legal">Legal &amp; DMCA</Link>
          <a href="https://www.themoviedb.org/" target="_blank" rel="noopener noreferrer">
            TMDB
          </a>
          <a
            href="https://www.viduki.net/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Viduki
          </a>
          <a href="https://vidfast.vc/" target="_blank" rel="noopener noreferrer">
            VidFast
          </a>
          <a href="https://vidy.st/" target="_blank" rel="noopener noreferrer">
            Vidy
          </a>
        </nav>
      </div>

      <div className="footer-bottom">
        <span>
          © {year} {siteName}. All rights reserved.
        </span>
        <span>Built for fast, low-friction discovery.</span>
      </div>
    </footer>
  );
}
