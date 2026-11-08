"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { dictionary } from "@/lib/content";
import { href, type Locale } from "@/lib/routes";
import { ICONS } from "./Timeline";

/*
 * Home "method" section: a wave path draws itself while you scroll,
 * a light travels along it and each step switches on as it is reached.
 */
const PATH =
  "M0 60C60 60 80 60 125 60S250 18 375 60 500 102 625 60 750 18 875 60 960 60 1000 60";
const NODES = [125, 375, 625, 875];

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

export function Pipeline({ locale }: { locale: Locale }) {
  const t = dictionary(locale);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const stage = root.querySelector<HTMLElement>(".pl-stage")!;
    const grid = root.querySelector<HTMLElement>(".pl-grid")!;
    const line = root.querySelector<SVGPathElement>(".pl-progress")!;
    const dot = root.querySelector<HTMLElement>(".pl-dot")!;
    const steps = [...root.querySelectorAll<HTMLElement>(".pl-step")];
    const nodes = [...root.querySelectorAll<HTMLElement>(".pl-node")];
    const total = line.getTotalLength();
    line.style.strokeDasharray = `${total} ${total}`;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const narrow = matchMedia("(max-width: 900px)");
    let raf = 0;

    const update = () => {
      raf = 0;
      let p = 1;
      if (!reduced) {
        const anchor = narrow.matches ? grid : stage;
        const r = anchor.getBoundingClientRect();
        p = narrow.matches
          ? (innerHeight * 0.7 - r.top) / r.height
          : (innerHeight * 0.82 - r.top) / (innerHeight * 0.5);
        p = Math.min(1, Math.max(0, p));
      }
      line.style.strokeDashoffset = String(total * (1 - p));
      const pt = line.getPointAtLength(total * p);
      dot.style.left = `${pt.x / 10}%`;
      dot.style.top = `${(pt.y / 120) * 100}%`;
      dot.style.opacity = p > 0.005 && p < 0.995 ? "1" : "0";
      grid.style.setProperty("--p", String(p));
      steps.forEach((step, i) => {
        const on = narrow.matches
          ? p >= i / steps.length + 0.02
          : pt.x >= NODES[i] - 4;
        step.classList.toggle("is-on", on || p >= 1);
        nodes[i]?.classList.toggle("is-on", on || p >= 1);
      });
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);
    narrow.addEventListener("change", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onScroll);
      narrow.removeEventListener("change", onScroll);
    };
  }, []);

  return (
    <section className="shell section pipeline" ref={ref}>
      <div className="section-heading">
        <div>
          <p className="eyebrow">{t.methodLabel}</p>
          <h2>{t.methodTitle}</h2>
        </div>
        <p>{t.methodIntro}</p>
      </div>
      <div className="pl-stage" aria-hidden="true">
        <svg viewBox="0 0 1000 120" preserveAspectRatio="none">
          <path className="pl-track" d={PATH} />
          <path className="pl-progress" d={PATH} />
        </svg>
        {NODES.map((x, i) => (
          <span
            key={x}
            className="pl-node"
            style={{ left: `${x / 10}%`, top: "50%" }}
          >
            0{i + 1}
          </span>
        ))}
        <span className="pl-dot" />
      </div>
      <ol className="pl-grid">
        {t.steps.map(([title, text], i) => (
          <li className="pl-step" key={title}>
            <div className="pl-head">
              <svg className="pl-icon" viewBox="0 0 56 56" aria-hidden="true">
                <path d={ICONS[i]} pathLength={1} />
              </svg>
              <span className="pl-num">0{i + 1}</span>
            </div>
            <h3>{title}</h3>
            <p>{text}</p>
            <p className="pl-deliverable">
              <span aria-hidden="true">→</span> {deliverables[locale][i]}
            </p>
          </li>
        ))}
      </ol>
      <Link className="text-link pl-link" href={href(locale, "metodo")}>
        {locale === "it"
          ? "Scopri il metodo nel dettaglio"
          : "See the full process"}
        <span aria-hidden="true">↗</span>
      </Link>
    </section>
  );
}
