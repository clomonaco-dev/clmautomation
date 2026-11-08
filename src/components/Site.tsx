import { LegalPage, legalRoutes, legalTitle } from "./LegalPage";
import { solutions, solutionRoutes } from "@/lib/solutions";
import { Presentation } from "./Presentation";
import { BuildStory } from "./BuildStory";
import { Motion } from "./Motion";
import { Timeline } from "./Timeline";
import { IntroArt, type ArtVariant } from "./IntroArt";
import { Projects } from "./Projects";
import { Pricing } from "./Pricing";
import { ProjectScene } from "./ProjectScene";
import { Pipeline } from "./Pipeline";
import { projects, sceneFor, type SceneKey } from "@/lib/projects";
import { NavigationReset } from "./NavigationReset";
import Link from "next/link";
import { dictionary, pageTitle } from "@/lib/content";
import {
  href,
  email,
  phone,
  mapsUrl,
  type Locale,
  type Route,
} from "@/lib/routes";
import { Header } from "./Header";
import { ContactForm } from "./ContactForm";
import { Reviews } from "./Reviews";
import { CookiePreferences } from "./CookiePreferences";

const Arrow = () => <span aria-hidden="true">↗</span>;
function Button({
  locale,
  children,
  outline = false,
}: {
  locale: Locale;
  children: React.ReactNode;
  outline?: boolean;
}) {
  return (
    <Link
      className={`button ${outline ? "button-outline" : ""}`}
      href={href(locale, "contatti")}
    >
      {children}
      <Arrow />
    </Link>
  );
}
function Intro({
  label,
  title,
  text,
  art,
  locale,
  scene,
}: {
  label: string;
  title: string;
  text: string;
  art?: ArtVariant;
  locale?: Locale;
  scene?: SceneKey;
}) {
  return (
    <section className={`shell page-intro${art || scene ? " has-art" : ""}`}>
      <div className="intro-copy">
        <p className="eyebrow">
          <span className="status-dot" />
          {label}
        </p>
        <h1>{title}</h1>
        <p className="intro-text">{text}</p>
      </div>
      {scene && locale ? (
        <div className="intro-art intro-scene" aria-hidden="true">
          <ProjectScene scene={scene} locale={locale} />
        </div>
      ) : (
        art && locale && <IntroArt variant={art} locale={locale} />
      )}
    </section>
  );
}
function BrowserArtwork({ locale }: { locale: Locale }) {
  const en = locale === "en";
  return (
    <div className="artwork" aria-hidden="true">
      <div className="art-orbit" />
      <div className="art-star">✳</div>
      <div className="mock-browser">
        <div className="browser-bar">
          <span>● ● ●</span>
          <span>your-next-website.it</span>
          <span>↗</span>
        </div>
        <div className="mock-content">
          <div className="mock-nav">
            <b>
              studio<span>®</span>
            </b>
            <span>About &nbsp; Projects &nbsp; Contact</span>
          </div>
          <div className="mock-main">
            <small>INDEPENDENT THINKING.</small>
            <p>
              {en ? "Good ideas." : "Belle idee."}
              <br />
              <i>{en ? "Made real." : "Fatte bene."}</i>
            </p>
            <div className="mock-circle">
              <span>↗</span>
            </div>
            <span className="mock-pill">
              {en ? "Discover our work" : "Scopri il nostro lavoro"} ↗
            </span>
          </div>
          <div className="mock-bottom">
            <span>DESIGN WITH PURPOSE</span>
            <span>01 — 03</span>
          </div>
        </div>
      </div>
      <div className="art-label">
        <span className="tiny-icon">↔</span>
        <div>
          <strong>
            {en ? "Every screen. Same care." : "Ogni schermo. La stessa cura."}
          </strong>
          <span>Desktop · Tablet · Mobile</span>
        </div>
      </div>
      <div className="art-caption">DESIGN + CODE + PURPOSE</div>
    </div>
  );
}
function Services({
  locale,
  full = false,
}: {
  locale: Locale;
  full?: boolean;
}) {
  const t = dictionary(locale);
  return (
    <section className="shell section" id="servizi">
      <div className="section-heading">
        <div>
          <p className="eyebrow">{t.servicesLabel}</p>
          <h2>{t.servicesTitle}</h2>
        </div>
        <p>{t.servicesIntro}</p>
      </div>
      <div className="card-grid service-grid">
        {t.services.slice(0, full ? 6 : 3).map(([title, text], index) => (
          <article className="service-card" key={title}>
            <div className="card-top">
              <span className="service-symbol" aria-hidden="true">
                {["⌘", "◈", "↗", "◎", "文", "↻"][index]}
              </span>
              <span className="number">0{index + 1}</span>
            </div>
            <h3>{title}</h3>
            <p>{text}</p>
            <Link
              href={href(locale, solutionRoutes[index])}
              className="card-link"
              aria-label={`${t.discover}: ${title}`}
            >
              <Arrow />
            </Link>
          </article>
        ))}
      </div>
      {!full && (
        <Link className="text-link section-link" href={href(locale, "servizi")}>
          {t.discover} <Arrow />
        </Link>
      )}
    </section>
  );
}
const deliverables = {
  it: [
    "Obiettivi e preventivo",
    "Mappa delle pagine e direzione visiva",
    "Sito da provare e revisionare",
    "Pubblicazione e consegna",
  ],
  en: [
    "Goals and project quote",
    "Page structure and visual direction",
    "A website to test and review",
    "Launch and handover",
  ],
};
function Process({ locale, full = false }: { locale: Locale; full?: boolean }) {
  const t = dictionary(locale);
  if (full)
    return (
      <section className="shell section process process-full">
        <Timeline steps={t.steps} deliverables={deliverables[locale]} />
      </section>
    );
  return (
    <section className="shell section process">
      <div className="section-heading">
        <div>
          <p className="eyebrow">{t.methodLabel}</p>
          <h2>{t.methodTitle}</h2>
        </div>
        <p>{t.methodIntro}</p>
      </div>
      <div className="process-grid">
        {t.steps.map(([title, text], index) => (
          <article key={title}>
            <div className="step-number">
              0{index + 1}
              <span aria-hidden="true">↗</span>
            </div>
            <h3>{title}</h3>
            <p>{text}</p>
            {full && (
              <p className="step-deliverable">
                {locale === "it"
                  ? [
                      "Obiettivi e preventivo",
                      "Mappa delle pagine e direzione visiva",
                      "Sito da provare e revisionare",
                      "Pubblicazione e consegna",
                    ][index]
                  : [
                      "Goals and project quote",
                      "Page structure and visual direction",
                      "A website to test and review",
                      "Launch and handover",
                    ][index]}
              </p>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
function Faq({ locale }: { locale: Locale }) {
  const t = dictionary(locale);
  return (
    <section className="shell section faq">
      <div>
        <p className="eyebrow">FAQ</p>
        <h2>{t.faqTitle}</h2>
      </div>
      <div>
        {t.faq.map(([q, a]) => (
          <details key={q}>
            <summary>
              {q}
              <span aria-hidden="true">+</span>
            </summary>
            <p>{a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
function About({ locale }: { locale: Locale }) {
  const t = dictionary(locale);
  return (
    <>
      <Intro
        label={t.aboutLabel}
        title={t.aboutTitle}
        text={t.aboutIntro}
        art="about"
        locale={locale}
      />
      <section className="shell section section-after-intro about-layout">
        <div className="about-poster">
          <span className="eyebrow">CLM AUTOMATION</span>
          <div className="poster-symbol" aria-hidden="true">
            ✳
          </div>
          <p>
            Ideas.
            <br />
            Design.
            <br />
            <i>Development.</i>
          </p>
          <span>GOZZANO, NOVARA — ITALIA</span>
        </div>
        <div className="about-copy">
          <p className="lead">{t.aboutDetails}</p>
          {t.aboutValues.map(([title, text]) => (
            <article key={title}>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="shell stats" aria-label={t.aboutLabel}>
        {(locale === "it"
          ? [
              [10, "+", "anni di sviluppo software"],
              [
                3,
                "",
                "settori ad alta affidabilità: automotive, aerospazio, difesa",
              ],
              [
                1,
                "",
                "interlocutore diretto, dalla prima domanda alla consegna",
              ],
              [
                100,
                "%",
                "del sito di tua proprietà, senza abbonamenti obbligatori",
              ],
            ]
          : [
              [10, "+", "years of software development"],
              [
                3,
                "",
                "high-reliability sectors: automotive, aerospace, defence",
              ],
              [
                1,
                "",
                "direct point of contact, from first question to handover",
              ],
              [100, "%", "of the website is yours, no mandatory subscription"],
            ]
        ).map(([n, suffix, label]) => (
          <div key={String(label)}>
            <strong data-count={n} data-suffix={suffix}>
              {n}
              {suffix}
            </strong>
            <span>{label}</span>
          </div>
        ))}
      </section>
      <section className="shell section documents">
        <div>
          <p className="eyebrow">{t.documents}</p>
          <h2>{t.certificates}</h2>
        </div>
        <div className="document-links">
          <a
            href="/documents/laurea.pdf"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t.degree}
            <span>PDF ↗</span>
          </a>
          <a
            href="/documents/abilitazione.pdf"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t.qualification}
            <span>PDF ↗</span>
          </a>
          <a
            href="/images/certificati/python.jpeg"
            target="_blank"
            rel="noopener noreferrer"
          >
            Python<span>↗</span>
          </a>
          <a
            href="/images/certificati/instructor.jpeg"
            target="_blank"
            rel="noopener noreferrer"
          >
            Instructor<span>↗</span>
          </a>
        </div>
      </section>
      <Reviews locale={locale} />
    </>
  );
}
function Contact({ locale }: { locale: Locale }) {
  const t = dictionary(locale);
  return (
    <>
      <Intro
        label={t.contactLabel}
        title={t.contactTitle}
        text={t.contactIntro}
        art="contact"
        locale={locale}
      />
      <section className="shell section section-after-intro contact-layout">
        <div className="contact-info">
          <a className="contact-email" href={`mailto:${email}`}>
            {email} <Arrow />
          </a>
          <a className="contact-phone" href="tel:+393473893863">
            {phone}
          </a>
          <a
            className="button button-outline"
            href="https://wa.me/393473893863"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t.whatsapp}
            <Arrow />
          </a>
          <div className="location">
            <p className="eyebrow">{t.location}</p>
            <h3>Gozzano, Novara</h3>
            <p>
              Viale Parona 33
              <br />
              28024 Gozzano (NO), Italia
            </p>
            <a
              className="text-link"
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {t.map}
              <Arrow />
            </a>
            <div className="location-art" aria-hidden="true">
              <span>45°44′N 8°26′E</span>
              <i />
              <b>CLM</b>
            </div>
          </div>
        </div>
        <ContactForm locale={locale} />
      </section>
    </>
  );
}
function CallToAction({ locale }: { locale: Locale }) {
  const t = dictionary(locale);
  return (
    <section className="cta">
      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          {[0, 1].map((copy) => (
            <span key={copy}>
              {t.services.map(([title]) => (
                <span key={title}>
                  {title}
                  <i>✳</i>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>
      <div className="shell cta-inner">
        <div>
          <p className="eyebrow">{t.ctaLabel}</p>
          <h2>{t.ctaTitle}</h2>
          <p>{t.ctaText}</p>
          <Button locale={locale}>{t.contact}</Button>
        </div>
        <span className="cta-star" aria-hidden="true">
          ✳
        </span>
      </div>
    </section>
  );
}
function Footer({ locale }: { locale: Locale }) {
  const t = dictionary(locale);
  return (
    <footer className="footer">
      <div className="shell">
        <div className="footer-grid">
          <div>
            <Link href={href(locale)} className="footer-brand">
              clm<span>.</span>
            </Link>
            <p>{t.footer}</p>
            <p className="company-details">
              CLM AUTOMATION DI CATALDO ING LO MONACO
              <br />
              {locale === "it" ? "P. IVA" : "VAT"} 02679950036
            </p>
            <a href={`mailto:${email}`}>{email}</a>
          </div>
          <div>
            <h3>{locale === "it" ? "Esplora" : "Explore"}</h3>
            {(
              [
                "chi-siamo",
                "servizi",
                "pacchetti",
                "metodo",
                "progetti",
                "recensioni",
                "contatti",
              ] as Route[]
            ).map((route) => (
              <Link key={route} href={href(locale, route)}>
                {pageTitle(locale, route)}
              </Link>
            ))}
          </div>
          <div>
            <h3>{t.examples}</h3>
            {projects(locale).map((p) => (
              <Link key={p.route} href={href(locale, p.route)}>
                {p.name}
              </Link>
            ))}
            <a href={mapsUrl} target="_blank" rel="noopener noreferrer">
              Gozzano · Novara ↗
            </a>
          </div>
        </div>
        <div className="footer-wordmark" aria-hidden="true">
          clm<span>.</span>
        </div>
        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} CLM Automation. {t.rights}
          </span>
          <div>
            {legalRoutes.map((r) => (
              <Link key={r} href={href(locale, r)}>
                {legalTitle(locale, r)}
              </Link>
            ))}
            <CookiePreferences locale={locale} />
            <span>DESIGNED & DEVELOPED WITH CARE ↗</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
export function Site({ locale, route }: { locale: Locale; route: Route }) {
  const t = dictionary(locale);
  return (
    <>
      <a href="#main" className="skip-link">
        {t.skip}
      </a>
      <Header locale={locale} route={route} />
      <NavigationReset />
      <Motion />
      <main id="main">
        {route === "" && (
          <>
            <section className="home-hero shell">
              <div className="hero-copy">
                <p className="eyebrow">
                  <span className="status-dot" />
                  {t.eyebrow}
                </p>
                <h1>
                  {t.hero[0]}
                  <br />
                  <span>{t.hero[1]}</span>
                </h1>
                <p className="hero-description">{t.intro}</p>
                <div className="actions">
                  <Button locale={locale}>{t.contact}</Button>
                  <Link
                    href={href(locale, "servizi")}
                    className="hero-secondary"
                  >
                    {t.discover}
                    <Arrow />
                  </Link>
                </div>
                <p className="hero-note">{t.heroNote}</p>
              </div>
              <BrowserArtwork locale={locale} />
            </section>
            <div className="trust-strip">
              <div className="shell">
                {t.approach.map((item) => (
                  <span key={item}>
                    <i aria-hidden="true">✳</i>
                    {item}
                  </span>
                ))}
                <span className="trust-location">
                  GOZZANO → OVUNQUE / EVERYWHERE
                </span>
              </div>
            </div>
            <BuildStory locale={locale} />
            <Presentation locale={locale} />
            <Services locale={locale} />
            <Projects locale={locale} />
            <Pipeline locale={locale} />
            <Reviews locale={locale} />
            <section className="shell about-teaser">
              <p className="eyebrow">{t.aboutLabel}</p>
              <h2>{t.aboutTitle}</h2>
              <p>{t.aboutIntro}</p>
              <Link className="text-link" href={href(locale, "chi-siamo")}>
                {t.nav[1]}
                <Arrow />
              </Link>
            </section>
          </>
        )}
        {route === "servizi" && (
          <>
            <Intro
              label={t.nav[2]}
              title={t.servicesTitle}
              text={t.servicesIntro}
              art="services"
              locale={locale}
            />
            <Services locale={locale} full />
            <Projects locale={locale} />
            <Faq locale={locale} />
          </>
        )}
        {route === "chi-siamo" && <About locale={locale} />}
        {route === "pacchetti" && (
          <>
            <Intro
              label={t.packageLabel}
              title={t.packageTitle}
              text={t.packageIntro}
              art="packages"
              locale={locale}
            />
            <Pricing locale={locale} />
            <Faq locale={locale} />
          </>
        )}
        {route === "metodo" && (
          <>
            <Intro
              label={t.nav[4]}
              title={t.methodTitle}
              text={t.methodIntro}
              art="method"
              locale={locale}
            />
            <Process locale={locale} full />
            <Faq locale={locale} />
          </>
        )}
        {route === "progetti" && (
          <>
            <Intro
              label={t.examplesLabel}
              title={
                locale === "it"
                  ? "Dal sito vetrina al gestionale. Per chiunque."
                  : "From websites to management software. For anyone."
              }
              text={t.examplesIntro}
              art="projects"
              locale={locale}
            />
            <Projects locale={locale} />
            <Pipeline locale={locale} />
          </>
        )}
        {route === "recensioni" && (
          <>
            <Intro
              label="Google Reviews"
              title={t.reviews}
              text={
                locale === "it"
                  ? "Le esperienze condivise su Google da chi ha lavorato con CLM Automation. Recensioni originali, consultabili anche sul profilo Google."
                  : "Experiences shared on Google by people who have worked with CLM Automation. Original reviews, also available on our Google profile."
              }
              art="reviews"
              locale={locale}
            />
            <Reviews locale={locale} />
            <Faq locale={locale} />
          </>
        )}
        {solutions(locale).some((s) => s.route === route) && (
          <Solution locale={locale} route={route} />
        )}
        {(legalRoutes as readonly string[]).includes(route) && (
          <LegalPage
            locale={locale}
            route={route as (typeof legalRoutes)[number]}
          />
        )}
        {route === "contatti" && <Contact locale={locale} />}
        {route !== "contatti" &&
          !(legalRoutes as readonly string[]).includes(route) && (
            <CallToAction locale={locale} />
          )}
      </main>
      <Footer locale={locale} />
    </>
  );
}

const priceAnchor: Partial<Record<Route, string>> = {
  "siti-web": "siti-vetrina",
  "e-commerce": "e-commerce",
  gestionali: "gestionali",
};
const solutionArt: Partial<Record<Route, ArtVariant>> = {
  "siti-web": "projects",
  "restyling-siti-web": "restyle",
  "sviluppo-web": "code",
  "seo-performance": "seo",
  "siti-multilingua": "globe",
  "assistenza-web": "support",
};
function Solution({ locale, route }: { locale: Locale; route: Route }) {
  const s = solutions(locale).find((s) => s.route === route)!;
  const en = locale === "en";
  return (
    <>
      <Intro
        label={en ? "Our services" : "I nostri servizi"}
        title={s.title}
        text={s.intro}
        art={solutionArt[s.route] ?? "projects"}
        scene={sceneFor(s.route)}
        locale={locale}
      />
      <section className="shell section section-after-intro solution-layout">
        <div>
          <img
            className="solution-image"
            src={"/images/optimized/metodo-" + s.image + ".webp"}
            alt=""
          />
          <p className="solution-caption">CLM AUTOMATION / {s.name}</p>
        </div>
        <div>
          <h2>
            {en ? "Start with what matters." : "Partiamo da ciò che conta."}
          </h2>
          <p className="solution-body">{s.body}</p>
          <h3>{en ? "What we can work on" : "Su cosa possiamo lavorare"}</h3>
          <ul className="check-list">
            {s.features.map((f) => (
              <li key={f}>
                <span aria-hidden="true">✓</span>
                {f}
              </li>
            ))}
          </ul>
          <p className="solution-body">{s.outcome}</p>
          <div className="actions">
            <Button locale={locale}>
              {en ? "Discuss your project" : "Parliamo del tuo progetto"}
            </Button>
            {priceAnchor[s.route] && (
              <Link
                className="hero-secondary"
                href={`${href(locale, "pacchetti")}#${priceAnchor[s.route]}`}
              >
                {en ? "See the packages" : "Vedi i pacchetti"}
                <Arrow />
              </Link>
            )}
          </div>
        </div>
      </section>
      <section className="shell section related">
        <p className="eyebrow">
          {en ? "A connected project" : "Un progetto completo"}
        </p>
        <h2>
          {en
            ? "The right pieces for your website."
            : "I tasselli giusti per il tuo sito."}
        </h2>
        <div className="related-grid">
          {solutions(locale)
            .filter((item) => item.route !== route)
            .slice(0, 3)
            .map((item) => (
              <Link href={href(locale, item.route)} key={item.route}>
                <h3>{item.name} ↗</h3>
                <p>{item.intro}</p>
              </Link>
            ))}
        </div>
      </section>
      <Faq locale={locale} />
    </>
  );
}
