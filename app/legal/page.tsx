import type { Metadata } from "next";
import Link from "next/link";
import { getSiteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Legal & DMCA",
  description:
    "How SBS handles content, copyright, privacy.",
  alternates: { canonical: "/legal" },
};

export default function LegalPage() {
  const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim();
  const siteUrl = getSiteUrl();

  return (
    <div className="legal-page">
      <header className="page-head legal-head">
        <div className="page-head-copy">
          <p className="page-eyebrow">Information</p>
          <h1>Legal &amp; DMCA</h1>
          <p>Last updated: November 2026</p>
        </div>
      </header>

      <div className="legal-body">
        <section>
          <h2>Content and hosting</h2>
          <p>
            SBS is a catalogue and discovery interface. This website does not host,
            upload, store, or transmit any video files. All media rights belong to their
            respective owners.
          </p>
        </section>

        <section>
          <h2>Copyright and DMCA</h2>
          <p>
            If you believe content accessible through an embedded player infringes your
            rights, contact the operator of this deployment
            {email ? (
              <>
                {" "}at <a href={`mailto:${email}`}>{email}</a>
              </>
            ) : null}
            . Include the exact URL, a description of the work, proof of ownership, and
            your contact details.
          </p>
          <p>
            Content removal requests that concern the catalogue itself can be
            directed to the contact above.
          </p>
        </section>

        <section>
          <h2>Privacy</h2>
          <p>
            SBS does not require an account and does not operate a user database. Your
            My List and continue-watching progress are stored locally in your browser
            using <code>localStorage</code>. They never leave your device unless you
            clear them or your browser does.
          </p>
        </section>

        <section>
          <h2>Terms of use</h2>
          <p>
            This site is provided for personal discovery and demonstration purposes. It
            is offered “as is”, without warranties of any kind. You are responsible for
            ensuring that your use of the site complies with the laws that apply to you.
            The operator may change or discontinue the service at any time.
          </p>
        </section>

        <p className="legal-footnote">
          Site address: <Link href="/">{siteUrl}</Link>
        </p>
      </div>
    </div>
  );
}
