import Link from "next/link";
import { dictionary } from "@/lib/content";
import { href, type Locale } from "@/lib/routes";
import { audiences, projects } from "@/lib/projects";
import { ProjectScene } from "./ProjectScene";

/* Bento showcase of transversal project types, each with a live mock-up. */
export function Projects({ locale }: { locale: Locale }) {
  const t = dictionary(locale);
  const it = locale === "it";
  const list = projects(locale);
  const people = audiences[locale];
  const half = Math.ceil(people.length / 2);
  return (
    <section className="projects section" id="progetti">
      <div className="shell">
        <div className="section-heading">
          <div>
            <p className="eyebrow">{t.examplesLabel}</p>
            <h2>{t.examplesTitle}</h2>
          </div>
          <p>{t.examplesIntro}</p>
        </div>
        <div className="pj-grid">
          {list.map((p, i) => (
            <Link
              key={p.route}
              href={href(locale, p.route)}
              className={`pj-card pj-${p.scene}${i === 0 ? " pj-wide" : ""}`}
            >
              <div className="pj-visual">
                <ProjectScene scene={p.scene} locale={locale} />
              </div>
              <div className="pj-info">
                <div>
                  <span className="pj-index">0{i + 1}</span>
                  <h3>{p.name}</h3>
                  <p>{p.text}</p>
                  <ul className="pj-tags">
                    {p.tags.map((tag) => (
                      <li key={tag}>{tag}</li>
                    ))}
                  </ul>
                </div>
                <span className="round-arrow" aria-hidden="true">
                  ↗
                </span>
              </div>
            </Link>
          ))}
          <div className="pj-card pj-audience">
            <div className="pj-audience-copy">
              <p className="eyebrow">
                {it ? "Per chi lavoriamo" : "Who we work with"}
              </p>
              <h3>
                {it
                  ? "Chiunque abbia qualcosa da presentare, vendere o organizzare."
                  : "Anyone with something to present, sell or organise."}
              </h3>
            </div>
            <div className="pj-people" aria-label={it ? "Settori" : "Sectors"}>
              {[people.slice(0, half), people.slice(half)].map((row, r) => (
                <div className={`pj-row pj-row-${r}`} key={r}>
                  <ul>
                    {row.map((name) => (
                      <li key={name}>{name}</li>
                    ))}
                  </ul>
                  <ul aria-hidden="true">
                    {row.map((name) => (
                      <li key={name}>{name}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <Link className="pj-audience-link" href={href(locale, "contatti")}>
              {it
                ? "Non trovi il tuo caso? Raccontacelo"
                : "Not seeing your case? Tell us about it"}
              <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>
        <p className="pj-note">
          {it
            ? "Le anteprime sono illustrazioni dimostrative: ogni progetto viene definito sui tuoi obiettivi."
            : "Previews are illustrative: every project is defined around your goals."}
        </p>
      </div>
    </section>
  );
}
