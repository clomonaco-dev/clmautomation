"use client";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import Link from "next/link";
import { dictionary } from "@/lib/content";
import { href, type Locale } from "@/lib/routes";
import { formatPrice, pricing, type Cell } from "@/lib/pricing";
import { ProjectScene } from "./ProjectScene";

/* Price list by project type: tabs → hero, three plans, comparison table. */

const ICONS: Record<string, string> = {
  "siti-vetrina":
    "M4 6h24v18H4zM4 11h24M8 8.5h.01M11 8.5h.01M8 15h9M8 19h6M20 15h4v5h-4z",
  "e-commerce":
    "M7 11h18l-1.5 15h-15zM12 11V9a4 4 0 0 1 8 0v2M12 16h.01M20 16h.01",
  "app-mobile":
    "M10 3h12a2 2 0 0 1 2 2v22a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zM14 6h4M15 25h2M11 10h10M11 14h7M11 18h10",
  gestionali: "M4 26V6M4 26h24M9 22v-6M14 22V11M19 22v-8M24 22V8",
};

function Mark({ value }: { value: Cell }) {
  if (value === true)
    return (
      <span className="pc-yes" aria-label="✓">
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <path d="M4 8.5l2.6 2.6L12 5.5" />
        </svg>
      </span>
    );
  if (value === false)
    return (
      <span className="pc-no" aria-label="—">
        —
      </span>
    );
  return <span className="pc-text">{value}</span>;
}

export function Pricing({ locale }: { locale: Locale }) {
  const t = dictionary(locale);
  const it = locale === "it";
  const cats = pricing(locale);
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const root = useRef<HTMLElement>(null);
  const first = useRef(true);

  // Deep links such as /pacchetti/#e-commerce
  useEffect(() => {
    const sync = () => {
      const i = cats.findIndex((c) => `#${c.key}` === location.hash);
      if (i >= 0) setActive(i);
    };
    sync();
    addEventListener("hashchange", sync);
    return () => removeEventListener("hashchange", sync);
  }, [cats]);

  // Prices count up when a category is shown
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const panel = root.current?.querySelector<HTMLElement>(
      `#pc-panel-${cats[active].key}`,
    );
    const els = [
      ...(panel?.querySelectorAll<HTMLElement>("[data-price]") ?? []),
    ];
    const start = performance.now();
    let raf = 0;
    const step = (now: number) => {
      const k = Math.min(1, (now - start) / 900);
      const e = 1 - Math.pow(1 - k, 3);
      for (const el of els) {
        const end = Number(el.dataset.price);
        el.textContent = formatPrice(end * (0.55 + 0.45 * e));
      }
      if (k < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [active, cats]);

  const select = (i: number, focus = false) => {
    setActive(i);
    history.replaceState(null, "", `#${cats[i].key}`);
    if (focus) tabs.current[i]?.focus();
  };
  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const n = cats.length;
    const keys: Record<string, number> = {
      ArrowRight: (active + 1) % n,
      ArrowDown: (active + 1) % n,
      ArrowLeft: (active - 1 + n) % n,
      ArrowUp: (active - 1 + n) % n,
      Home: 0,
      End: n - 1,
    };
    if (e.key in keys) {
      e.preventDefault();
      select(keys[e.key], true);
    }
  };

  return (
    <section
      ref={root}
      className="shell section section-after-intro pricing"
      style={{ "--pc-i": active } as React.CSSProperties}
    >
      <div
        className="pc-tabs"
        role="tablist"
        aria-label={it ? "Tipologia di progetto" : "Project type"}
        onKeyDown={onKey}
      >
        <span className="pc-indicator" aria-hidden="true" />
        {cats.map((c, i) => (
          <button
            key={c.key}
            ref={(el) => {
              tabs.current[i] = el;
            }}
            role="tab"
            id={`pc-tab-${c.key}`}
            aria-selected={i === active}
            aria-controls={`pc-panel-${c.key}`}
            tabIndex={i === active ? 0 : -1}
            className="pc-tab"
            onClick={() => select(i)}
          >
            <svg viewBox="0 0 32 32" aria-hidden="true">
              <path d={ICONS[c.key]} />
            </svg>
            <span className="pc-tab-name">{c.name}</span>
            <span className="pc-tab-short">{c.short}</span>
            <span className="pc-tab-from">
              {t.from} €{formatPrice(c.plans[0].price)}
            </span>
          </button>
        ))}
      </div>

      {cats.map((c, ci) => (
        <div
          key={c.key}
          role="tabpanel"
          id={`pc-panel-${c.key}`}
          aria-labelledby={`pc-tab-${c.key}`}
          hidden={ci !== active}
          className="pc-panel"
        >
          <div className="pc-hero">
            <div>
              <p className="eyebrow">
                <span className="status-dot" />
                {c.short}
              </p>
              <h2>{c.name}</h2>
              <p className="pc-desc">{c.description}</p>
              <p className="pc-ideal-label">
                {it ? "Ideale per" : "Ideal for"}
              </p>
              <ul className="pc-ideal">
                {c.ideal.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
              {c.route && (
                <Link className="text-link" href={href(locale, c.route)}>
                  {it ? "Scopri come lavoriamo su" : "How we approach"}{" "}
                  {c.name.toLowerCase()}
                  <span aria-hidden="true">↗</span>
                </Link>
              )}
            </div>
            <div className="pc-scene" aria-hidden="true">
              {ci === active && (
                <ProjectScene
                  scene={c.scene}
                  locale={locale}
                  className="is-live"
                />
              )}
            </div>
          </div>

          <div className="pc-plans">
            {c.plans.map((plan, i) => (
              <article
                key={plan.name}
                className={`pc-card${i === 1 ? " is-featured" : ""}`}
                style={{ "--d": `${i * 90}ms` } as React.CSSProperties}
              >
                <header>
                  <span className="pc-level" aria-hidden="true">
                    {[0, 1, 2].map((b) => (
                      <i key={b} className={b <= i ? "on" : ""} />
                    ))}
                  </span>
                  <h3>{plan.name}</h3>
                  {i === 1 && (
                    <span className="pc-badge">
                      {it ? "Consigliato" : "Recommended"}
                    </span>
                  )}
                </header>
                <p className="pc-price">
                  <small>{t.from}</small>
                  <span className="pc-currency">€</span>
                  <span data-price={plan.price}>{formatPrice(plan.price)}</span>
                </p>
                <p className="pc-tagline">{plan.tagline}</p>
                <p className="pc-time">
                  <svg viewBox="0 0 16 16" aria-hidden="true">
                    <circle cx="8" cy="8" r="6.2" />
                    <path d="M8 4.6V8l2.4 1.6" />
                  </svg>
                  {it ? "Tempi indicativi" : "Indicative timing"}:{" "}
                  <strong>{plan.time}</strong>
                </p>
                <p className="pc-includes">
                  {i === 0
                    ? it
                      ? "Include"
                      : "Includes"
                    : it
                      ? `Tutto di ${c.plans[i - 1].name}, più:`
                      : `Everything in ${c.plans[i - 1].name}, plus:`}
                </p>
                <ul>
                  {plan.features.map((f) => (
                    <li key={f}>
                      <svg viewBox="0 0 16 16" aria-hidden="true">
                        <path d="M4 8.5l2.6 2.6L12 5.5" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  className={`button${i === 1 ? "" : " button-outline"}`}
                  href={href(locale, "contatti")}
                >
                  {t.quote}
                  <span aria-hidden="true">↗</span>
                </Link>
              </article>
            ))}
          </div>

          <div className="pc-compare">
            <div className="pc-compare-head">
              <h3>{it ? "Confronta i pacchetti" : "Compare the packages"}</h3>
              <p>
                {it
                  ? "Le differenze, voce per voce."
                  : "The differences, line by line."}
              </p>
            </div>
            <div className="pc-table-wrap">
              <table>
                <thead>
                  <tr>
                    <th scope="col">
                      <span className="sr-only">
                        {it ? "Caratteristica" : "Feature"}
                      </span>
                    </th>
                    {c.plans.map((p, i) => (
                      <th
                        scope="col"
                        key={p.name}
                        className={i === 1 ? "is-featured" : ""}
                      >
                        {p.name}
                        <small>
                          {t.from} €{formatPrice(p.price)}
                        </small>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {c.rows.map(([label, ...cells]) => (
                    <tr key={label}>
                      <th scope="row">{label}</th>
                      {cells.map((cell, i) => (
                        <td key={i} className={i === 1 ? "is-featured" : ""}>
                          <Mark value={cell} />
                        </td>
                      ))}
                    </tr>
                  ))}
                  <tr>
                    <th scope="row">
                      {it ? "Tempi indicativi" : "Indicative timing"}
                    </th>
                    {c.plans.map((p, i) => (
                      <td key={p.name} className={i === 1 ? "is-featured" : ""}>
                        <span className="pc-text">{p.time}</span>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="pc-excluded">
              <svg viewBox="0 0 16 16" aria-hidden="true">
                <circle cx="8" cy="8" r="6.2" />
                <path d="M8 7.2V11M8 5h.01" />
              </svg>
              {c.excluded}
            </p>
          </div>
        </div>
      ))}

      <p className="price-note">{t.priceNote}</p>

      <div className="custom-band">
        <div>
          <p className="eyebrow">
            {it ? "Non sai quale scegliere?" : "Not sure which one to choose?"}
          </p>
          <h2>
            {it
              ? "Partiamo dal tuo obiettivo, non dal pacchetto."
              : "Let’s start from your goal, not from a package."}
          </h2>
          <p>
            {it
              ? "Raccontaci cosa vuoi ottenere: ti consigliamo il livello giusto o un percorso su misura. Web app, portali e landing page sono sempre su preventivo."
              : "Tell us what you want to achieve: we will suggest the right level or a tailored path. Web apps, portals and landing pages are always quoted to scope."}
          </p>
        </div>
        <div className="custom-links">
          <Link href={href(locale, "contatti")}>
            {it ? "Richiedi una consulenza" : "Ask for advice"}
            <span aria-hidden="true">↗</span>
          </Link>
          <Link href={href(locale, "web-app")}>
            {it ? "Web app & portali" : "Web apps & portals"}
            <span aria-hidden="true">↗</span>
          </Link>
          <Link href={href(locale, "landing-page")}>
            Landing page
            <span aria-hidden="true">↗</span>
          </Link>
          <a
            href="https://wa.me/393473893863"
            target="_blank"
            rel="noopener noreferrer"
          >
            WhatsApp
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </section>
  );
}
