export default function HomeLoading() {
  return (
    <div className="home" aria-busy="true" aria-label="Loading homepage">
      <div className="hero skeleton-hero">
        <div className="hero-content">
          <div className="skeleton skeleton-line is-short" />
          <div className="skeleton skeleton-title" />
          <div className="skeleton skeleton-line" />
          <div className="skeleton skeleton-line is-medium" />
          <div className="skeleton skeleton-button" />
        </div>
      </div>

      <div className="home-rows">
        {[0, 1, 2].map((row) => (
          <section className="media-section" key={row}>
            <div className="section-head">
              <div className="skeleton skeleton-heading" />
            </div>
            <div className="row-scroller">
              {Array.from({ length: 8 }, (_, index) => (
                <div className="skeleton skeleton-card" key={index} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
