export function BrowseSkeleton({ count = 18 }: { count?: number }) {
  return (
    <div className="browse-page" aria-busy="true" aria-label="Loading catalogue">
      <header className="page-head">
        <div className="page-head-copy">
          <div className="skeleton skeleton-line is-short" />
          <div className="skeleton skeleton-heading" />
          <div className="skeleton skeleton-line is-medium" />
        </div>
      </header>

      <div className="media-grid">
        {Array.from({ length: count }, (_, index) => (
          <div className="skeleton skeleton-card" key={index} />
        ))}
      </div>
    </div>
  );
}
