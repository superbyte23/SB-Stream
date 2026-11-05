import Link from "next/link";
import { siteName } from "@/lib/site";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <Link className="logo footer-logo" href="/" aria-label="SBS home">
            <img src="/logo.png" alt="SBS" style={{ height: "24px", width: "auto", display: "block" }} />
          </Link>
          <p className="footer-disclaimer">
            SBS is a catalogue and discovery interface. We do not host, upload, or
            store any video content. All media rights belong to their respective owners.
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
