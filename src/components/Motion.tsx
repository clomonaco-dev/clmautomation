"use client";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/*
 * Site-wide motion layer.
 * - Reveal on scroll: the selectors below fade/slide in once visible.
 *   An inline script in <head> adds `.motion` before first paint (unless the
 *   visitor prefers reduced motion), so nothing flashes before hydration.
 * - Reading progress bar, header elevation, card spotlight, counters and
 *   scroll-linked rotation of the decorative stars.
 */
export const REVEAL = [
  ".hero-copy > *",
  ".artwork",
  ".intro-copy > *",
  ".intro-art",
  ".section-heading > *",
  ".service-card",
  ".pj-card",
  ".pj-note",
  ".pl-step",
  ".custom-band",
  ".process-grid > article",
  ".pricing-card",
  ".price-note",
  ".faq > div:first-child",
  ".faq details",
  ".about-poster",
  ".about-copy > *",
  ".documents > div:first-child",
  ".document-links > a",
  ".related > :not(.related-grid)",
  ".related-grid > a",
  ".review-card",
  ".review-score",
  ".solution-layout > div",
  ".contact-info > *",
  ".contact-form",
  ".about-teaser",
  ".cta-inner > div",
  ".stats > div",
  ".tl-step",
  ".footer-grid > div",
].join(",");

const SPOT =
  ".service-card, .pricing-card, .related-grid > a, .review-card, .pj-card";
const SPIN: [string, number, number][] = [
  [".cta-star", 15, 0.12],
  [".poster-symbol", 0, 0.1],
  [".art-star", 10, -0.08],
];

export function Motion() {
  const pathname = usePathname();
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("motion-live");
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const animate = root.classList.contains("motion") && !reduced;

    // Looping scenes only animate while on screen
    const live = new IntersectionObserver(
      (entries) => {
        for (const e of entries)
          e.target.classList.toggle("is-live", e.isIntersecting);
      },
      { rootMargin: "80px 0px" },
    );
    document.querySelectorAll(".ps").forEach((el) => live.observe(el));

    // Reveal
    const seen = new WeakSet<Element>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const el = e.target as HTMLElement;
          el.classList.add("rv-in");
          io.unobserve(el);
          const done = () => el.classList.add("rv-done");
          el.addEventListener("transitionend", done, { once: true });
          setTimeout(done, 1600);
          if (el.matches("[data-count]")) count(el);
          el.querySelectorAll<HTMLElement>("[data-count]").forEach(count);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    const scan = () => {
      document.querySelectorAll<HTMLElement>(REVEAL).forEach((el) => {
        if (seen.has(el)) return;
        seen.add(el);
        const siblings = el.parentElement
          ? [...el.parentElement.children].filter((c) => c.matches(REVEAL))
          : [];
        el.style.setProperty(
          "--rv-i",
          String(Math.min(6, Math.max(0, siblings.indexOf(el)))),
        );
        if (animate) io.observe(el);
        else el.classList.add("rv-in", "rv-done");
      });
    };
    scan();
    const main = document.getElementById("main");
    const mo = new MutationObserver(() => scan());
    if (main) mo.observe(main, { childList: true, subtree: true });

    // Counters
    function count(el: HTMLElement) {
      if (el.dataset.counted) return;
      el.dataset.counted = "1";
      const end = Number(el.dataset.count);
      const suffix = el.dataset.suffix || "";
      if (!animate) return;
      const start = performance.now();
      const step = (now: number) => {
        const t = Math.min(1, (now - start) / 1400);
        const v = Math.round(end * (1 - Math.pow(1 - t, 3)));
        el.textContent = v + suffix;
        if (t < 1) requestAnimationFrame(step);
      };
      el.textContent = "0" + suffix;
      requestAnimationFrame(step);
    }

    // Scroll-linked: progress bar, header, rotating stars
    const header = document.querySelector<HTMLElement>(".header");
    const spinners = SPIN.flatMap(([sel, base, k]) =>
      [...document.querySelectorAll<HTMLElement>(sel)].map(
        (el) => [el, base, k] as const,
      ),
    );
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = root.scrollHeight - innerHeight;
      const p = max > 0 ? scrollY / max : 0;
      if (barRef.current) barRef.current.style.transform = `scaleX(${p})`;
      header?.classList.toggle("is-scrolled", scrollY > 8);
      if (!animate) return;
      for (const [el, base, k] of spinners) {
        const r = el.getBoundingClientRect();
        if (r.bottom < -200 || r.top > innerHeight + 200) continue;
        const offset = r.top + r.height / 2 - innerHeight / 2;
        el.style.transform = `rotate(${base + offset * k}deg)`;
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);

    // Spotlight following the pointer on cards
    const onMove = (e: PointerEvent) => {
      const card = (e.target as Element | null)?.closest?.(
        SPOT,
      ) as HTMLElement | null;
      if (!card) return;
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${e.clientX - r.left}px`);
      card.style.setProperty("--my", `${e.clientY - r.top}px`);
    };
    if (animate)
      document.addEventListener("pointermove", onMove, { passive: true });

    return () => {
      io.disconnect();
      live.disconnect();
      mo.disconnect();
      cancelAnimationFrame(raf);
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onScroll);
      document.removeEventListener("pointermove", onMove);
    };
  }, [pathname]);

  return (
    <div className="scroll-progress" aria-hidden="true">
      <div ref={barRef} />
    </div>
  );
}
