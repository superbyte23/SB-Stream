import Image from "next/image";
import type { CastMember } from "@/lib/types";
import { tmdbImage } from "@/lib/images";
import { gradientFor, initials } from "@/lib/utils";

interface CastRowProps {
  cast: CastMember[];
  title?: string;
}

export function CastRow({ cast, title = "Top cast" }: CastRowProps) {
  if (!cast.length) return null;

  return (
    <section className="cast-section" aria-labelledby="cast-heading">
      <div className="section-head">
        <h2 id="cast-heading">{title}</h2>
      </div>
      <div className="cast-scroller">
        {cast.map((member) => {
          const image = tmdbImage(member.profilePath, "w185");
          return (
            <article className="cast-member" key={member.id}>
              <div className="cast-avatar">
                {image ? (
                  <Image src={image} alt="" fill sizes="90px" />
                ) : (
                  <span
                    className="cast-fallback"
                    style={{ background: gradientFor(member.id % 360) }}
                    aria-hidden="true"
                  >
                    {initials(member.name)}
                  </span>
                )}
              </div>
              <p className="cast-name">{member.name}</p>
              {member.character ? <p className="cast-character">{member.character}</p> : null}
            </article>
          );
        })}
      </div>
    </section>
  );
}
