import type { Metadata } from "next";
import Link from "next/link";
import { getSiteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Legal & DMCA",
  description:
    "How 1FLEX handles content, copyright, privacy, and third-party playback services.",
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
            1FLEX is a catalogue and discovery interface. This website does not host,
            upload, store, or transmit any video files. Title information and artwork
            are provided by <a href="https://www.themoviedb.org/" target="_blank" rel="noopener noreferrer">TMDB</a>.
            Video playback is embedded from independent third-party providers. All
            media rights belong to their respective owners.
          </p>
        </section>

        <section>
          <h2>Copyright and DMCA</h2>
          <p>
            If you believe content accessible through an embedded player infringes your
            rights, contact the third-party provider that hosts the stream directly.
            Providers publish their own contact and removal processes. You may also
            contact the operator of this deployment
            {email ? (
              <>
                {" "}at <a href={`mailto:${email}`}>{email}</a>
              </>
            ) : null}
            . Include the exact URL, a description of the work, proof of ownership, and
            your contact details.
          </p>
          <p>
            This deployment does not control third-party servers and cannot remove
            content from them. Requests that concern the catalogue itself can be
            directed to the contact above.
          </p>
        </section>

        <section>
          <h2>Privacy</h2>
          <p>
            1FLEX does not require an account and does not operate a user database. Your
            My List and continue-watching progress are stored locally in your browser
            using <code>localStorage</code>. They never leave your device unless you
            clear them or your browser does. Server logs may be processed by the hosting
            provider for security and reliability.
          </p>
          <p>
            Third-party players receive the TMDB identifier of the title you choose to
            play. Their own privacy policies apply while you use them.
          </p>
        </section>

        <section>
          <h2>Third-party services</h2>
          <p>
            Playback is provided by{" "}
            <a href="https://www.viduki.net/" target="_blank" rel="noopener noreferrer">Viduki</a>,{" "}
            <a href="https://vidfast.vc/" target="_blank" rel="noopener noreferrer">VidFast</a>, and{" "}
            <a href="https://vidy.st/" target="_blank" rel="noopener noreferrer">Vidy</a>.
            These services are independent of this site. Their availability, content,
            and terms may change without notice.
          </p>
        </section>

        <section>
          <h2>Terms of use</h2>
          <p>
            This site is provided for personal discovery and demonstration purposes. It
            is offered “as is”, without warranties of any kind. You are responsible for
            ensuring that your use of any third-party service complies with the laws
            that apply to you. The operator may change or discontinue the service at any
            time.
          </p>
        </section>

        <p className="legal-footnote">
          Site address: <Link href="/">{siteUrl}</Link>
        </p>
      </div>
    </div>
  );
}
