"use client";
import { useEffect, useRef } from "react";
import type { Locale } from "@/lib/routes";

/*
 * Scroll-driven SVG story: the visitor scrolls and a website is built
 * in front of them (brief → wireframe → design → code → launch).
 * Timeline values in data attributes are expressed in progress units (0–1):
 *   data-o="in0 in1 [out0 out1]"  opacity (+ optional data-x / data-y offset)
 *   data-d="a b"                  stroke drawing
 *   data-t="a b" data-full="…"    typing
 *   data-cv="a b"                 cover that slides away (code typing)
 */

const copy = {
  it: {
    label: "Come nasce un sito che ti rappresenta",
    eyebrow: "Dietro le quinte · Scorri",
    title: "Dall’idea al sito online. Un pixel alla volta.",
    hint: "Scorri per costruire il sito",
    steps: [
      [
        "Analisi",
        "Obiettivi, pubblico e contenuti: prima di disegnare capiamo cosa deve ottenere il tuo sito.",
      ],
      [
        "Struttura",
        "Wireframe e griglia: ogni pagina ha una gerarchia chiara e un percorso diretto verso il contatto.",
      ],
      [
        "Design",
        "Colori, tipografia e immagini costruiscono un’identità riconoscibile e coerente.",
      ],
      [
        "Sviluppo",
        "Codice pulito e componenti responsive: lo stesso sito, curato su desktop, tablet e smartphone.",
      ],
      [
        "Online",
        "Verifiche su velocità, accessibilità e SEO, poi dominio e pubblicazione. Il tuo sito è pronto.",
      ],
    ],
    chips: ["Obiettivi", "Pubblico", "Contenuti", "Tono di voce"],
    links: ["Studio", "Servizi", "Contatti"],
    navCta: "Contattaci",
    h1: ["Belle idee.", "Fatte bene."],
    body: [
      "Progettiamo e sviluppiamo siti web",
      "per chi vuole presentarsi bene e",
      "trasformare una visita in un contatto.",
    ],
    cta: "Parliamo del progetto ↗",
    cards: ["Siti vetrina", "Restyling", "Sviluppo"],
    compiled: "✓ Compilato · pronto per la pubblicazione",
    checks: ["Performance", "Accessibilità", "SEO", "Responsive"],
    online: "Online",
  },
  en: {
    label: "How a website that represents you is made",
    eyebrow: "Behind the scenes · Scroll",
    title: "From idea to live website. One pixel at a time.",
    hint: "Scroll to build the website",
    steps: [
      [
        "Discovery",
        "Goals, audience and content: before drawing anything, we understand what your website must achieve.",
      ],
      [
        "Structure",
        "Wireframes and grid: every page gets a clear hierarchy and a direct path to getting in touch.",
      ],
      [
        "Design",
        "Colour, typography and imagery shape a recognisable, consistent identity.",
      ],
      [
        "Development",
        "Clean code and responsive components: the same website, crafted for desktop, tablet and phone.",
      ],
      [
        "Launch",
        "Speed, accessibility and SEO checks, then domain and publishing. Your website is live.",
      ],
    ],
    chips: ["Goals", "Audience", "Content", "Tone of voice"],
    links: ["About", "Work", "Contact"],
    navCta: "Contact us",
    h1: ["Good ideas.", "Made real."],
    body: [
      "We design and build websites for",
      "people who want to present their",
      "work well and turn visits into enquiries.",
    ],
    cta: "Let’s talk about it ↗",
    cards: ["Websites", "Redesign", "Development"],
    compiled: "✓ Compiled · ready to deploy",
    checks: ["Performance", "Accessibility", "SEO", "Responsive"],
    online: "Live",
  },
} as const;

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const seg = (p: number, a: number, b: number) => clamp((p - a) / (b - a));
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const inOut = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// Cursor path [progress, x, y] in viewBox coordinates.
const CURSOR: [number, number, number][] = [
  [0, 900, 620],
  [0.05, 140, 90],
  [0.06, 140, 90],
  [0.14, 760, 510],
  [0.19, 870, 236],
  [0.23, 690, 150],
  [0.28, 320, 222],
  [0.33, 610, 300],
  [0.37, 450, 450],
  [0.47, 860, 186],
  [0.53, 858, 252],
  [0.58, 330, 236],
  [0.64, 770, 210],
  [0.7, 770, 210],
  [0.77, 840, 300],
  [0.82, 300, 114],
  [0.88, 300, 114],
  [0.92, 140, 304],
  [0.95, 140, 304],
  [1, 152, 314],
];

const MONO = "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
const C = {
  bp: "#8fb6f0",
  faint: "#9fb6d6",
  ink: "#19283f",
  muted: "#5a687c",
  accent: "#a8c9f6",
  blue: "#4574ac",
  ok: "#5fd4a0",
  panel: "#0a1526",
};
const CODE = {
  kw: "#8fb6f0",
  fn: "#f0c27b",
  tag: "#7fd0ff",
  attr: "#c9a7f5",
  str: "#b6e3a8",
  pn: "#6f86a8",
  tx: "#e6eefb",
};
const CHAR = 6.3;

type Track = {
  el: SVGElement | HTMLElement;
  kind: "o" | "d" | "t" | "cv";
  v: number[];
  x: number;
  y: number;
  len?: number;
  full?: string;
  x0?: number;
  w0?: number;
};

function parseTracks(root: Element): Track[] {
  const list: Track[] = [];
  root
    .querySelectorAll<SVGElement>("[data-o],[data-d],[data-t],[data-cv]")
    .forEach((el) => {
      const d = el.dataset;
      const nums = (s?: string) => (s ? s.split(" ").map(Number) : []);
      const base = { el, x: Number(d.x || 0), y: Number(d.y || 0) };
      if (d.o) list.push({ ...base, kind: "o", v: nums(d.o) });
      if (d.d) {
        const len = (el as unknown as SVGGeometryElement).getTotalLength();
        el.style.strokeDasharray = `${len} ${len}`;
        list.push({ ...base, kind: "d", v: nums(d.d), len });
      }
      if (d.t) list.push({ ...base, kind: "t", v: nums(d.t), full: d.full });
      if (d.cv)
        list.push({
          ...base,
          kind: "cv",
          v: nums(d.cv),
          x0: Number(el.getAttribute("x")),
          w0: Number(el.getAttribute("width")),
        });
    });
  return list;
}

export function BuildStory({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const root = sectionRef.current;
    const stage = stageRef.current;
    const svg = svgRef.current;
    if (!root || !stage || !svg) return;
    const q = <T extends Element>(s: string) => svg.querySelector<T>(s)!;
    const tracks = parseTracks(svg);
    const frame = q<SVGRectElement>("[data-ref=frame]");
    const size = q<SVGGElement>("[data-ref=size]");
    const sizeText = q<SVGTextElement>("[data-ref=size-text]");
    const browser = q<SVGGElement>("[data-ref=browser]");
    const cursor = q<SVGGElement>("[data-ref=cursor]");
    const caret = q<SVGRectElement>("[data-ref=caret]");
    const percent = q<SVGTextElement>("[data-ref=percent]");
    const phase = q<SVGTextElement>("[data-ref=phase]");
    const bar = q<SVGRectElement>("[data-ref=bar]");
    const ripples = [
      ...svg.querySelectorAll<SVGCircleElement>("[data-ref=ripple]"),
    ];
    const covers = tracks.filter((tr) => tr.kind === "cv");
    const steps = [...root.querySelectorAll<HTMLElement>("[data-step]")];
    const counter = root.querySelector<HTMLElement>("[data-ref=counter]");
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    let lastStep = -1;

    const apply = (p: number) => {
      for (const tr of tracks) {
        const [a, b, c, d] = tr.v;
        const s = tr.el.style;
        if (tr.kind === "o") {
          const vin = a < 0 ? 1 : easeOut(seg(p, a, b));
          const vout = c === undefined ? 0 : easeOut(seg(p, c, d));
          s.opacity = String(vin * (1 - vout));
          if (tr.x || tr.y)
            s.transform = `translate(${(1 - vin + vout) * tr.x}px, ${(1 - vin) * tr.y}px)`;
        } else if (tr.kind === "d") {
          s.strokeDashoffset = String(tr.len! * (1 - easeOut(seg(p, a, b))));
        } else if (tr.kind === "t") {
          const n = Math.round(tr.full!.length * seg(p, a, b));
          if (tr.el.textContent!.length !== n)
            tr.el.textContent = tr.full!.slice(0, n);
        } else {
          const v = seg(p, a, b);
          tr.el.setAttribute("x", String(tr.x0! + tr.w0! * v));
          tr.el.setAttribute("width", String(tr.w0! * (1 - v)));
        }
      }

      // Selection rectangle dragged by the cursor: the browser frame.
      const g = inOut(seg(p, 0.06, 0.14));
      frame.setAttribute("width", String(620 * g));
      frame.setAttribute("height", String(420 * g));
      frame.style.opacity = p < 0.06 ? "0" : "1";
      size.style.opacity = String(
        seg(p, 0.058, 0.066) * (1 - seg(p, 0.145, 0.16)),
      );
      size.setAttribute(
        "transform",
        `translate(${140 + 620 * g + 22} ${90 + 420 * g - 8})`,
      );
      sizeText.textContent = `${Math.round(1240 * g)} × ${Math.round(840 * g)}`;

      // Browser shrinks to make room for code and devices.
      const m = inOut(seg(p, 0.6, 0.67));
      browser.setAttribute(
        "transform",
        `translate(${lerp(0, -65, m)} ${lerp(0, 26, m)}) scale(${lerp(1, 0.82, m)})`,
      );

      // Cursor.
      let i = 0;
      while (i < CURSOR.length - 2 && p > CURSOR[i + 1][0]) i++;
      const [p0, x0, y0] = CURSOR[i];
      const [p1, x1, y1] = CURSOR[i + 1];
      const k = inOut(seg(p, p0, p1));
      const press = (p > 0.05 && p < 0.14) || (p > 0.945 && p < 0.96);
      cursor.setAttribute(
        "transform",
        `translate(${lerp(x0, x1, k)} ${lerp(y0, y1, k)}) scale(${press ? 0.9 : 1})`,
      );

      // Typing caret follows the line being written.
      const typing = covers.find((cv) => {
        const v = seg(p, cv.v[0], cv.v[1]);
        return v > 0 && v < 1;
      });
      if (typing) {
        caret.style.opacity = "1";
        caret.setAttribute("x", typing.el.getAttribute("x")!);
        caret.setAttribute(
          "y",
          String(Number(typing.el.getAttribute("y")) + 1),
        );
      } else caret.style.opacity = "0";

      // Launch waves.
      ripples.forEach((r, n) => {
        const v = seg(p, 0.86 + n * 0.035, 1);
        r.setAttribute("r", String(60 + easeOut(v) * 300));
        r.style.opacity = String(v > 0 ? (1 - v) * 0.55 : 0);
      });

      // HUD and step list.
      const step = Math.min(4, Math.floor(p * 5));
      percent.textContent = `${String(Math.round(p * 100)).padStart(3, "0")}%`;
      bar.setAttribute("width", String(912 * p));
      steps.forEach((el) => {
        const n = Number(el.dataset.step);
        el.style.setProperty("--sp", String(seg(p, n * 0.2, (n + 1) * 0.2)));
      });
      if (step !== lastStep) {
        lastStep = step;
        phase.textContent = `0${step + 1} — ${t.steps[step][0].toUpperCase()}`;
        steps.forEach((el) =>
          el.classList.toggle("is-active", Number(el.dataset.step) === step),
        );
        if (counter) counter.textContent = `0${step + 1} / 05`;
      }
    };

    // Phones: crop the decorative margins so the scene reads larger.
    const narrow = matchMedia("(max-width: 700px)");
    const setViewBox = () =>
      svg.setAttribute(
        "viewBox",
        narrow.matches ? "40 38 900 566" : "0 0 960 640",
      );
    setViewBox();
    narrow.addEventListener("change", setViewBox);

    let target = 0;
    let current = 0;
    let raf = 0;
    const measure = () => {
      const r = root.getBoundingClientRect();
      const top = parseFloat(getComputedStyle(stage).top) || 0;
      const range = r.height - stage.offsetHeight;
      // The last few percent of the track hold the finished site in place.
      return range > 0 ? clamp((top - r.top) / (range * 0.94)) : 1;
    };
    const tick = () => {
      current += (target - current) * 0.11;
      if (Math.abs(target - current) < 0.0004) current = target;
      apply(current);
      raf = current === target ? 0 : requestAnimationFrame(tick);
    };
    const onScroll = () => {
      if (media.matches) return;
      target = measure();
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const setMode = () => {
      cancelAnimationFrame(raf);
      raf = 0;
      root.classList.toggle("is-static", media.matches);
      current = target = media.matches ? 1 : measure();
      apply(current);
    };
    setMode();
    root.classList.add("is-ready");
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);
    media.addEventListener("change", setMode);
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onScroll);
      media.removeEventListener("change", setMode);
      narrow.removeEventListener("change", setViewBox);
    };
  }, [t]);

  const codeLines: [string, string][][] = [
    [
      ["export ", CODE.kw],
      ["function ", CODE.kw],
      ["Hero", CODE.fn],
      ["() {", CODE.pn],
    ],
    [
      ["  return ", CODE.kw],
      ["(", CODE.pn],
    ],
    [
      ["    <", CODE.pn],
      ["section ", CODE.tag],
      ["className", CODE.attr],
      ["=", CODE.pn],
      ['"hero"', CODE.str],
      [">", CODE.pn],
    ],
    [
      ["      <", CODE.pn],
      ["h1", CODE.tag],
      [">", CODE.pn],
      [t.h1[0], CODE.tx],
      ["</", CODE.pn],
      ["h1", CODE.tag],
      [">", CODE.pn],
    ],
    [
      ["      <", CODE.pn],
      ["em", CODE.tag],
      [">", CODE.pn],
      [t.h1[1], CODE.tx],
      ["</", CODE.pn],
      ["em", CODE.tag],
      [">", CODE.pn],
    ],
    [
      ["      <", CODE.pn],
      ["Button ", CODE.fn],
      ["href", CODE.attr],
      ["=", CODE.pn],
      ['"/contatti"', CODE.str],
      [" />", CODE.pn],
    ],
    [
      ["    </", CODE.pn],
      ["section", CODE.tag],
      [">", CODE.pn],
    ],
    [["  );", CODE.pn]],
    [["}", CODE.pn]],
  ];

  const cards = [170, 362, 554];
  const rings = [124, 244, 364, 484];

  return (
    <section ref={sectionRef} className="build-story" aria-label={t.label}>
      <div ref={stageRef} className="bs-stage">
        <div className="shell bs-inner">
          <div className="bs-copy">
            <p className="eyebrow">
              <span className="status-dot" />
              {t.eyebrow}
            </p>
            <h2>{t.title}</h2>
            <div className="bs-segments" aria-hidden="true">
              {t.steps.map((_, i) => (
                <span key={i} data-step={i} />
              ))}
              <b data-ref="counter">01 / 05</b>
            </div>
            <ol className="bs-steps">
              {t.steps.map(([title, text], i) => (
                <li
                  key={title}
                  className={`bs-step${i === 0 ? " is-active" : ""}`}
                  data-step={i}
                >
                  <div className="bs-step-head">
                    <span>0{i + 1}</span>
                    <h3>{title}</h3>
                  </div>
                  <div className="bs-step-body">
                    <p>{text}</p>
                  </div>
                  <i className="bs-step-bar" aria-hidden="true" />
                </li>
              ))}
            </ol>
          </div>

          <div className="bs-canvas" aria-hidden="true">
            <svg ref={svgRef} viewBox="0 0 960 640" role="presentation">
              <defs>
                <pattern
                  id="bs-grid"
                  width="20"
                  height="20"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M20 0H0V20"
                    fill="none"
                    stroke="#ffffff"
                    strokeOpacity=".045"
                  />
                </pattern>
                <pattern
                  id="bs-grid-major"
                  width="100"
                  height="100"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M100 0H0V100"
                    fill="none"
                    stroke="#ffffff"
                    strokeOpacity=".07"
                  />
                </pattern>
                <radialGradient id="bs-glow" cx="50%" cy="50%" r="50%">
                  <stop offset="0" stopColor="#3a72c4" stopOpacity=".38" />
                  <stop offset="1" stopColor="#3a72c4" stopOpacity="0" />
                </radialGradient>
                <linearGradient id="bs-img" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#1c3558" />
                  <stop offset="1" stopColor="#3a6fb5" />
                </linearGradient>
                <clipPath id="bs-img-clip">
                  <rect x="470" y="170" width="260" height="200" rx="10" />
                </clipPath>
                <clipPath id="bs-tab-img">
                  <rect x="656" y="206" width="168" height="92" rx="6" />
                </clipPath>
                <clipPath id="bs-ph-img">
                  <rect x="792" y="278" width="96" height="62" rx="6" />
                </clipPath>
                <radialGradient id="bs-fade" cx="50%" cy="48%" r="58%">
                  <stop offset=".55" stopColor="#fff" />
                  <stop offset="1" stopColor="#000" />
                </radialGradient>
                <mask id="bs-grid-mask">
                  <rect
                    x="-200"
                    y="-100"
                    width="1360"
                    height="840"
                    fill="url(#bs-fade)"
                  />
                </mask>
                <filter
                  id="bs-shadow"
                  x="-20%"
                  y="-20%"
                  width="140%"
                  height="150%"
                >
                  <feDropShadow
                    dx="0"
                    dy="18"
                    stdDeviation="20"
                    floodColor="#020814"
                    floodOpacity=".55"
                  />
                </filter>
              </defs>

              {/* Workspace */}
              <g mask="url(#bs-grid-mask)">
                <rect
                  x="-200"
                  y="-100"
                  width="1360"
                  height="840"
                  fill="url(#bs-grid)"
                />
                <rect
                  x="-200"
                  y="-100"
                  width="1360"
                  height="840"
                  fill="url(#bs-grid-major)"
                />
              </g>
              <circle cx="450" cy="300" r="380" fill="url(#bs-glow)" />
              <g
                fill="none"
                stroke={C.accent}
                strokeWidth="1.2"
                mask="url(#bs-grid-mask)"
              >
                {[0, 1, 2].map((n) => (
                  <circle
                    key={n}
                    data-ref="ripple"
                    cx="304"
                    cy="272"
                    r="60"
                    opacity="0"
                  />
                ))}
              </g>

              {/* HUD */}
              <g className="bs-hud">
                <g
                  fontFamily={MONO}
                  fontSize="9"
                  letterSpacing="1.5"
                  fill="#ffffff"
                  fillOpacity=".45"
                >
                  <text x="24" y="30">
                    CLM / BUILD PIPELINE
                  </text>
                  <text
                    data-ref="phase"
                    x="936"
                    y="30"
                    textAnchor="end"
                    fillOpacity=".75"
                  >
                    01 — {t.steps[0][0].toUpperCase()}
                  </text>
                  <text
                    data-ref="percent"
                    x="936"
                    y="608"
                    textAnchor="end"
                    fontSize="10"
                    fillOpacity=".8"
                  >
                    000%
                  </text>
                  <text x="24" y="608">
                    v1.0 · {locale.toUpperCase()}
                  </text>
                </g>
                <rect
                  x="24"
                  y="618"
                  width="912"
                  height="2"
                  rx="1"
                  fill="#ffffff"
                  fillOpacity=".1"
                />
                <rect
                  data-ref="bar"
                  x="24"
                  y="618"
                  width="0"
                  height="2"
                  rx="1"
                  fill={C.accent}
                />
                {[0, 1, 2, 3, 4].map((n) => (
                  <rect
                    key={n}
                    x={24 + n * 182.4}
                    y="614"
                    width="1"
                    height="10"
                    fill="#ffffff"
                    fillOpacity=".3"
                  />
                ))}
              </g>

              {/* Scroll hint */}
              <g
                data-o="-1 -1 .008 .035"
                fill="none"
                stroke="#ffffff"
                strokeOpacity=".7"
              >
                <rect
                  x="439"
                  y="262"
                  width="22"
                  height="34"
                  rx="11"
                  strokeWidth="1.5"
                />
                <line
                  className="bs-wheel"
                  x1="450"
                  y1="270"
                  x2="450"
                  y2="277"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <text
                  x="450"
                  y="324"
                  textAnchor="middle"
                  fill="#ffffff"
                  fillOpacity=".75"
                  stroke="none"
                  fontSize="12"
                  letterSpacing=".5"
                >
                  {t.hint}
                </text>
              </g>

              {/* Rulers (structure) */}
              <g
                data-o=".16 .22 .58 .62"
                fill={C.faint}
                fontFamily={MONO}
                fontSize="7"
              >
                <line
                  x1="140"
                  y1="66"
                  x2="760"
                  y2="66"
                  stroke={C.faint}
                  strokeOpacity=".35"
                />
                {Array.from({ length: 21 }, (_, n) => (
                  <line
                    key={n}
                    x1={140 + n * 31}
                    x2={140 + n * 31}
                    y1={n % 4 === 0 ? 58 : 62}
                    y2="66"
                    stroke={C.faint}
                    strokeOpacity=".5"
                  />
                ))}
                {[0, 1, 2, 3, 4, 5].map((n) => (
                  <text key={n} x={140 + n * 124 + 3} y="56" fillOpacity=".7">
                    {n * 248}
                  </text>
                ))}
                <line
                  x1="112"
                  y1="90"
                  x2="112"
                  y2="510"
                  stroke={C.faint}
                  strokeOpacity=".35"
                />
                {Array.from({ length: 15 }, (_, n) => (
                  <line
                    key={n}
                    y1={90 + n * 30}
                    y2={90 + n * 30}
                    x1={n % 2 === 0 ? 104 : 108}
                    x2="112"
                    stroke={C.faint}
                    strokeOpacity=".5"
                  />
                ))}
                {[0, 1, 2, 3, 4].map((n) => (
                  <text
                    key={n}
                    x="100"
                    y={93 + n * 105}
                    textAnchor="end"
                    fillOpacity=".7"
                  >
                    {n * 210}
                  </text>
                ))}
              </g>
              <g
                data-o=".3 .34 .58 .62"
                stroke={C.faint}
                strokeOpacity=".6"
                fontFamily={MONO}
                fontSize="8"
              >
                <line x1="140" y1="532" x2="760" y2="532" />
                <line x1="140" y1="526" x2="140" y2="538" />
                <line x1="760" y1="526" x2="760" y2="538" />
                <rect
                  x="418"
                  y="524"
                  width="64"
                  height="16"
                  rx="8"
                  fill="#0d1c33"
                />
                <text
                  x="450"
                  y="535"
                  textAnchor="middle"
                  fill={C.accent}
                  stroke="none"
                >
                  1240 px
                </text>
              </g>

              {/* Brief chips (analysis) */}
              <g
                data-o=".1 .13 .38 .42"
                fontFamily={MONO}
                fontSize="8"
                fill="#ffffff"
                fillOpacity=".5"
                letterSpacing="1.5"
              >
                <text x="790" y="138">
                  BRIEF
                </text>
              </g>
              {t.chips.map((chip, n) => (
                <g
                  key={chip}
                  data-o={`${0.105 + n * 0.018} ${0.135 + n * 0.018} .38 .42`}
                  data-x="16"
                >
                  <rect
                    x="790"
                    y={150 + n * 38}
                    width="146"
                    height="28"
                    rx="14"
                    fill="#ffffff"
                    fillOpacity=".06"
                    stroke="#ffffff"
                    strokeOpacity=".16"
                  />
                  <circle cx="806" cy={164 + n * 38} r="3.5" fill={C.ok} />
                  <text x="818" y={168 + n * 38} fontSize="10.5" fill="#dfe9f8">
                    {chip}
                  </text>
                </g>
              ))}

              {/* Style tile (design) */}
              <g
                data-o=".43 .47 .58 .61"
                fontFamily={MONO}
                fontSize="8"
                fill="#ffffff"
                fillOpacity=".5"
                letterSpacing="1.5"
              >
                <text x="790" y="138">
                  STYLE
                </text>
              </g>
              <g data-o=".44 .49 .58 .61" data-y="12">
                <text
                  x="788"
                  y="198"
                  fontSize="54"
                  fontWeight="600"
                  letterSpacing="-2"
                  fill="#ffffff"
                >
                  Aa
                </text>
                <text x="790" y="218" fontSize="9" fill={C.faint}>
                  DM Sans — 400 · 600
                </text>
              </g>
              {["#162b49", "#386fbb", "#a8c9f6", "#dce3ed", "#f7f9fc"].map(
                (col, n) => (
                  <circle
                    key={col}
                    data-o={`${0.47 + n * 0.012} ${0.5 + n * 0.012} .58 .61`}
                    data-y="10"
                    cx={801 + n * 28}
                    cy="252"
                    r="10.5"
                    fill={col}
                    stroke="#ffffff"
                    strokeOpacity=".35"
                  />
                ),
              )}
              {[
                ["H1", 72, 140],
                ["H2", 48, 96],
                ["Body", 16, 46],
              ].map(([name, px, w], n) => (
                <g
                  key={name}
                  data-o={`${0.52 + n * 0.012} ${0.55 + n * 0.012} .58 .61`}
                  data-x="12"
                  fontFamily={MONO}
                  fontSize="8"
                >
                  <text x="790" y={296 + n * 20} fill={C.faint}>
                    {name}
                  </text>
                  <rect
                    x="822"
                    y={290 + n * 20}
                    width={w}
                    height="6"
                    rx="3"
                    fill={C.accent}
                    fillOpacity={0.85 - n * 0.2}
                  />
                  <text x={828 + Number(w)} y={296 + n * 20} fill={C.faint}>
                    {px}
                  </text>
                </g>
              ))}

              {/* Browser */}
              <g data-ref="browser">
                <g data-o=".4 .48" filter="url(#bs-shadow)">
                  <rect
                    x="140"
                    y="90"
                    width="620"
                    height="420"
                    rx="14"
                    fill="#f7f9fc"
                  />
                </g>
                <g data-o=".4 .46">
                  <path
                    d="M154 90h592a14 14 0 0 1 14 14v20H140v-20a14 14 0 0 1 14-14z"
                    fill="#e6edf7"
                  />
                  <rect
                    x="260"
                    y="99"
                    width="300"
                    height="17"
                    rx="8.5"
                    fill="#ffffff"
                  />
                  <line x1="140" y1="124" x2="760" y2="124" stroke="#d5dfec" />
                </g>
                <rect
                  data-ref="frame"
                  x="140"
                  y="90"
                  width="0"
                  height="0"
                  rx="14"
                  fill="none"
                  stroke={C.bp}
                  strokeWidth="1.5"
                />
                <line
                  data-d=".14 .17"
                  x1="140"
                  y1="124"
                  x2="760"
                  y2="124"
                  stroke={C.bp}
                  strokeOpacity=".7"
                />
                <g data-o=".15 .18" fill={C.bp}>
                  <circle cx="160" cy="107" r="4" fillOpacity=".8" />
                  <circle cx="174" cy="107" r="4" fillOpacity=".55" />
                  <circle cx="188" cy="107" r="4" fillOpacity=".35" />
                </g>
                <rect
                  data-d=".16 .2"
                  x="260"
                  y="99"
                  width="300"
                  height="17"
                  rx="8.5"
                  fill="none"
                  stroke={C.bp}
                  strokeOpacity=".7"
                />
                <g data-o=".81 .83">
                  <rect
                    x="270"
                    y="104"
                    width="7"
                    height="6"
                    rx="1.2"
                    fill="#3d8f6a"
                  />
                  <path
                    d="M271.5 104v-1.6a2 2 0 0 1 4 0V104"
                    fill="none"
                    stroke="#3d8f6a"
                    strokeWidth="1.2"
                  />
                </g>
                <text
                  data-t=".82 .88"
                  data-full={
                    locale === "it" ? "iltuostudio.it" : "yourstudio.com"
                  }
                  x="283"
                  y="111"
                  fontSize="9"
                  fill={C.ink}
                />

                {/* Column guides */}
                <g data-o=".22 .27 .38 .44" fill={C.bp} fillOpacity=".09">
                  {Array.from({ length: 12 }, (_, n) => (
                    <rect
                      key={n}
                      x={170 + n * 48}
                      y="128"
                      width="32"
                      height="378"
                    />
                  ))}
                </g>

                {/* Wireframe */}
                <g
                  data-o=".18 .2 .42 .5"
                  fill="none"
                  stroke={C.bp}
                  strokeWidth="1.2"
                >
                  <rect
                    data-d=".2 .23"
                    x="170"
                    y="142"
                    width="56"
                    height="14"
                    rx="3"
                  />
                  {[500, 544, 588].map((x, n) => (
                    <rect
                      key={x}
                      data-d={`${0.21 + n * 0.008} ${0.235 + n * 0.008}`}
                      x={x}
                      y="146"
                      width="34"
                      height="7"
                      rx="3.5"
                    />
                  ))}
                  <rect
                    data-d=".22 .25"
                    x="650"
                    y="139"
                    width="80"
                    height="22"
                    rx="11"
                  />
                  <rect
                    data-d=".24 .27"
                    x="170"
                    y="186"
                    width="250"
                    height="30"
                    rx="4"
                  />
                  <rect
                    data-d=".25 .28"
                    x="170"
                    y="224"
                    width="210"
                    height="30"
                    rx="4"
                  />
                  {[268, 282, 296].map((y, n) => (
                    <rect
                      key={y}
                      data-d={`${0.26 + n * 0.006} ${0.28 + n * 0.006}`}
                      x="170"
                      y={y}
                      width={230 - n * 25}
                      height="6"
                      rx="3"
                    />
                  ))}
                  <rect
                    data-d=".27 .3"
                    x="170"
                    y="322"
                    width="128"
                    height="30"
                    rx="15"
                  />
                  <rect
                    data-d=".28 .32"
                    x="470"
                    y="170"
                    width="260"
                    height="200"
                    rx="10"
                  />
                  <line
                    data-d=".3 .33"
                    x1="470"
                    y1="170"
                    x2="730"
                    y2="370"
                    strokeOpacity=".6"
                  />
                  <line
                    data-d=".305 .335"
                    x1="730"
                    y1="170"
                    x2="470"
                    y2="370"
                    strokeOpacity=".6"
                  />
                  {cards.map((x, n) => (
                    <rect
                      key={x}
                      data-d={`${0.31 + n * 0.012} ${0.34 + n * 0.012}`}
                      x={x}
                      y="400"
                      width="176"
                      height="84"
                      rx="8"
                    />
                  ))}
                </g>
                <g
                  data-o=".29 .33 .42 .46"
                  fontFamily={MONO}
                  fontSize="7.5"
                  fill={C.bp}
                  letterSpacing="1"
                >
                  <text x="232" y="153">
                    NAV
                  </text>
                  <text x="426" y="205">
                    H1 · 64/1.04
                  </text>
                  <text x="304" y="341">
                    CTA
                  </text>
                  <text x="600" y="274" textAnchor="middle">
                    IMG 4:3
                  </text>
                  <text x="170" y="395">
                    CARD × 3
                  </text>
                </g>

                {/* Selection on the image while structuring */}
                <g data-o=".32 .335 .37 .39">
                  <rect
                    x="470"
                    y="170"
                    width="260"
                    height="200"
                    rx="10"
                    fill="none"
                    stroke="#5aa2ff"
                    strokeWidth="1.5"
                  />
                  {[
                    [470, 170],
                    [730, 170],
                    [470, 370],
                    [730, 370],
                  ].map(([x, y]) => (
                    <rect
                      key={`${x}-${y}`}
                      x={x - 4}
                      y={y - 4}
                      width="8"
                      height="8"
                      fill="#ffffff"
                      stroke="#5aa2ff"
                      strokeWidth="1.5"
                    />
                  ))}
                  <rect
                    x="566"
                    y="378"
                    width="68"
                    height="16"
                    rx="4"
                    fill="#5aa2ff"
                  />
                  <text
                    x="600"
                    y="389"
                    textAnchor="middle"
                    fontFamily={MONO}
                    fontSize="8"
                    fill="#ffffff"
                  >
                    520 × 400
                  </text>
                </g>

                {/* Design */}
                <g data-o=".44 .48" data-y="6">
                  <text
                    x="170"
                    y="155"
                    fontSize="16"
                    fontWeight="700"
                    letterSpacing="-1"
                    fill={C.ink}
                  >
                    studio<tspan fill="#4479bd">.</tspan>
                  </text>
                  {t.links.map((link, n) => (
                    <text
                      key={link}
                      x={500 + n * 44}
                      y="153"
                      fontSize="8.5"
                      fill={C.muted}
                    >
                      {link}
                    </text>
                  ))}
                  <rect
                    x="650"
                    y="139"
                    width="80"
                    height="22"
                    rx="11"
                    fill={C.ink}
                  />
                  <text
                    x="690"
                    y="153"
                    textAnchor="middle"
                    fontSize="8.5"
                    fontWeight="600"
                    fill="#ffffff"
                  >
                    {t.navCta}
                  </text>
                </g>
                <text
                  data-o=".45 .5"
                  data-y="12"
                  x="170"
                  y="214"
                  fontSize="35"
                  fontWeight="600"
                  letterSpacing="-1.6"
                  fill={C.ink}
                >
                  {t.h1[0]}
                </text>
                <text
                  data-o=".47 .52"
                  data-y="12"
                  x="170"
                  y="252"
                  fontSize="35"
                  fontFamily="Georgia, serif"
                  fontStyle="italic"
                  letterSpacing="-1"
                  fill={C.blue}
                >
                  {t.h1[1]}
                </text>
                <g data-o=".49 .53" data-y="8" fontSize="9.5" fill={C.muted}>
                  {t.body.map((line, n) => (
                    <text key={line} x="170" y={274 + n * 14}>
                      {line}
                    </text>
                  ))}
                </g>
                <g data-o=".5 .54" data-y="8">
                  <rect
                    x="170"
                    y="322"
                    width="128"
                    height="30"
                    rx="15"
                    fill={C.ink}
                  />
                  <rect
                    data-o=".948 .962"
                    x="170"
                    y="322"
                    width="128"
                    height="30"
                    rx="15"
                    fill="#386fbb"
                  />
                  <text
                    x="234"
                    y="340.5"
                    textAnchor="middle"
                    fontSize="9"
                    fontWeight="600"
                    fill="#ffffff"
                  >
                    {t.cta}
                  </text>
                </g>
                <g data-o=".48 .55" clipPath="url(#bs-img-clip)">
                  <rect
                    x="470"
                    y="170"
                    width="260"
                    height="200"
                    fill="url(#bs-img)"
                  />
                  <circle
                    cx="648"
                    cy="262"
                    r="62"
                    fill="none"
                    stroke={C.accent}
                    strokeWidth="22"
                  />
                  <circle
                    cx="520"
                    cy="320"
                    r="90"
                    fill="#ffffff"
                    fillOpacity=".05"
                  />
                  <text
                    x="648"
                    y="273"
                    textAnchor="middle"
                    fontSize="30"
                    fill={C.accent}
                  >
                    ↗
                  </text>
                  <text
                    x="490"
                    y="196"
                    fontFamily={MONO}
                    fontSize="7"
                    letterSpacing="2"
                    fill="#ffffff"
                    fillOpacity=".75"
                  >
                    INDEPENDENT THINKING.
                  </text>
                  <rect
                    x="490"
                    y="338"
                    width="90"
                    height="16"
                    rx="3"
                    fill={C.accent}
                  />
                  <text x="497" y="349" fontSize="7" fill="#1c3558">
                    Discover our work ↗
                  </text>
                </g>
                {cards.map((x, n) => (
                  <g
                    key={x}
                    data-o={`${0.52 + n * 0.012} ${0.56 + n * 0.012}`}
                    data-y="10"
                  >
                    <rect
                      x={x}
                      y="400"
                      width="176"
                      height="84"
                      rx="8"
                      fill="#ffffff"
                      stroke="#dce3ed"
                    />
                    <rect
                      x={x + 14}
                      y="414"
                      width="22"
                      height="22"
                      rx="6"
                      fill="#c9ddfb"
                    />
                    <text
                      x={x + 25}
                      y="429"
                      textAnchor="middle"
                      fontSize="11"
                      fill={C.ink}
                    >
                      {["⌘", "◈", "↗"][n]}
                    </text>
                    <text
                      x={x + 158}
                      y="428"
                      textAnchor="end"
                      fontFamily={MONO}
                      fontSize="7.5"
                      fill="#8a97a8"
                    >
                      0{n + 1}
                    </text>
                    <text
                      x={x + 14}
                      y="458"
                      fontSize="10.5"
                      fontWeight="600"
                      fill={C.ink}
                    >
                      {t.cards[n]}
                    </text>
                    <rect
                      x={x + 14}
                      y="466"
                      width="120"
                      height="4"
                      rx="2"
                      fill="#dce3ed"
                    />
                  </g>
                ))}

                {/* Typographic selection while refining */}
                <g data-o=".555 .565 .595 .605">
                  <rect
                    x="164"
                    y="182"
                    width="270"
                    height="80"
                    fill="none"
                    stroke="#5aa2ff"
                    strokeWidth="1.3"
                  />
                  <rect
                    x="164"
                    y="166"
                    width="120"
                    height="14"
                    rx="3"
                    fill="#5aa2ff"
                  />
                  <text
                    x="170"
                    y="176"
                    fontFamily={MONO}
                    fontSize="7.5"
                    fill="#ffffff"
                  >
                    H1 · DM Sans 600
                  </text>
                </g>
              </g>

              {/* Code editor */}
              <g data-o=".6 .64 .71 .745" data-x="40">
                <rect
                  x="590"
                  y="80"
                  width="330"
                  height="330"
                  rx="12"
                  fill={C.panel}
                  stroke="#ffffff"
                  strokeOpacity=".14"
                />
                {[608, 620, 632].map((x) => (
                  <circle
                    key={x}
                    cx={x}
                    cy="98"
                    r="3.5"
                    fill="#ffffff"
                    fillOpacity=".22"
                  />
                ))}
                <rect
                  x="648"
                  y="88"
                  width="72"
                  height="20"
                  rx="5"
                  fill="#ffffff"
                  fillOpacity=".07"
                />
                <text
                  x="658"
                  y="101.5"
                  fontFamily={MONO}
                  fontSize="9"
                  fill="#cfe0f7"
                >
                  Hero.tsx
                </text>
                <line
                  x1="590"
                  y1="114"
                  x2="920"
                  y2="114"
                  stroke="#ffffff"
                  strokeOpacity=".1"
                />
                <g fontFamily={MONO} fontSize="10.5">
                  {codeLines.map((parts, n) => {
                    const y = 140 + n * 22;
                    const raw = parts.map((part) => part[0]).join("");
                    const indent = raw.length - raw.trimStart().length;
                    const first = [
                      parts[0][0].trimStart(),
                      parts[0][1],
                    ] as const;
                    const start = 0.612 + n * 0.0065;
                    return (
                      <g key={n}>
                        <text x="606" y={y} fill="#ffffff" fillOpacity=".25">
                          {n + 1}
                        </text>
                        <text x={628 + indent * CHAR} y={y}>
                          <tspan fill={first[1]}>{first[0]}</tspan>
                          {parts.slice(1).map(([s, col], j) => (
                            <tspan
                              key={j}
                              fill={col}
                              style={{ whiteSpace: "pre" }}
                            >
                              {s}
                            </tspan>
                          ))}
                        </text>
                        <rect
                          data-cv={`${start} ${start + 0.0065}`}
                          x={628 + indent * CHAR - 1}
                          y={y - 11}
                          width={(raw.length - indent) * CHAR + 6}
                          height="15"
                          fill={C.panel}
                        />
                      </g>
                    );
                  })}
                </g>
                <rect
                  data-ref="caret"
                  x="628"
                  y="130"
                  width="6"
                  height="13"
                  fill={C.accent}
                  opacity="0"
                />
                <line
                  x1="590"
                  y1="352"
                  x2="920"
                  y2="352"
                  stroke="#ffffff"
                  strokeOpacity=".1"
                />
                <text
                  data-t=".675 .69"
                  data-full="$ npm run build"
                  x="606"
                  y="374"
                  fontFamily={MONO}
                  fontSize="9.5"
                  fill={C.faint}
                />
                <text
                  data-o=".692 .698"
                  x="606"
                  y="394"
                  fontFamily={MONO}
                  fontSize="9.5"
                  fill={C.ok}
                >
                  {t.compiled}
                </text>
              </g>

              {/* Devices */}
              <g data-o=".725 .77" data-y="24">
                <rect
                  x="640"
                  y="110"
                  width="200"
                  height="282"
                  rx="14"
                  fill="#f7f9fc"
                  stroke={C.bp}
                  strokeWidth="1.5"
                  filter="url(#bs-shadow)"
                />
                <text
                  x="656"
                  y="138"
                  fontSize="11"
                  fontWeight="700"
                  letterSpacing="-.6"
                  fill={C.ink}
                >
                  studio<tspan fill="#4479bd">.</tspan>
                </text>
                <rect
                  x="770"
                  y="128"
                  width="54"
                  height="14"
                  rx="7"
                  fill={C.ink}
                />
                <text
                  x="656"
                  y="170"
                  fontSize="19"
                  fontWeight="600"
                  letterSpacing="-.8"
                  fill={C.ink}
                >
                  {t.h1[0]}
                </text>
                <text
                  x="656"
                  y="192"
                  fontSize="19"
                  fontFamily="Georgia, serif"
                  fontStyle="italic"
                  fill={C.blue}
                >
                  {t.h1[1]}
                </text>
                <g clipPath="url(#bs-tab-img)">
                  <rect
                    x="656"
                    y="206"
                    width="168"
                    height="92"
                    fill="url(#bs-img)"
                  />
                  <circle
                    cx="780"
                    cy="252"
                    r="30"
                    fill="none"
                    stroke={C.accent}
                    strokeWidth="11"
                  />
                </g>
                {[656, 744].map((x) => (
                  <g key={x}>
                    <rect
                      x={x}
                      y="310"
                      width="80"
                      height="62"
                      rx="6"
                      fill="#ffffff"
                      stroke="#dce3ed"
                    />
                    <rect
                      x={x + 9}
                      y="319"
                      width="14"
                      height="14"
                      rx="4"
                      fill="#c9ddfb"
                    />
                    <rect
                      x={x + 9}
                      y="345"
                      width="52"
                      height="4"
                      rx="2"
                      fill="#c3cedd"
                    />
                    <rect
                      x={x + 9}
                      y="354"
                      width="38"
                      height="4"
                      rx="2"
                      fill="#dce3ed"
                    />
                  </g>
                ))}
              </g>
              <g data-o=".745 .79" data-y="30">
                <rect
                  x="780"
                  y="190"
                  width="120"
                  height="236"
                  rx="18"
                  fill="#f7f9fc"
                  stroke={C.bp}
                  strokeWidth="1.5"
                  filter="url(#bs-shadow)"
                />
                <rect
                  x="822"
                  y="198"
                  width="36"
                  height="6"
                  rx="3"
                  fill={C.ink}
                />
                <text
                  x="792"
                  y="226"
                  fontSize="9.5"
                  fontWeight="700"
                  letterSpacing="-.5"
                  fill={C.ink}
                >
                  studio<tspan fill="#4479bd">.</tspan>
                </text>
                <g stroke={C.ink} strokeWidth="1.4" strokeLinecap="round">
                  <line x1="876" y1="218" x2="888" y2="218" />
                  <line x1="876" y1="222" x2="888" y2="222" />
                  <line x1="876" y1="226" x2="888" y2="226" />
                </g>
                <text
                  x="792"
                  y="252"
                  fontSize="13.5"
                  fontWeight="600"
                  letterSpacing="-.6"
                  fill={C.ink}
                >
                  {t.h1[0]}
                </text>
                <text
                  x="792"
                  y="268"
                  fontSize="13.5"
                  fontFamily="Georgia, serif"
                  fontStyle="italic"
                  fill={C.blue}
                >
                  {t.h1[1]}
                </text>
                <g clipPath="url(#bs-ph-img)">
                  <rect
                    x="792"
                    y="278"
                    width="96"
                    height="62"
                    fill="url(#bs-img)"
                  />
                  <circle
                    cx="862"
                    cy="308"
                    r="20"
                    fill="none"
                    stroke={C.accent}
                    strokeWidth="8"
                  />
                </g>
                <rect
                  x="792"
                  y="350"
                  width="76"
                  height="18"
                  rx="9"
                  fill={C.ink}
                />
                <rect
                  x="792"
                  y="378"
                  width="96"
                  height="34"
                  rx="6"
                  fill="#ffffff"
                  stroke="#dce3ed"
                />
                <rect
                  x="800"
                  y="386"
                  width="10"
                  height="10"
                  rx="3"
                  fill="#c9ddfb"
                />
                <rect
                  x="800"
                  y="401"
                  width="54"
                  height="4"
                  rx="2"
                  fill="#c3cedd"
                />
              </g>

              {/* Launch */}
              <g data-o=".88 .91" data-y="8">
                <rect
                  x="50"
                  y="64"
                  width="86"
                  height="24"
                  rx="12"
                  fill="#ffffff"
                  fillOpacity=".08"
                  stroke={C.ok}
                  strokeOpacity=".55"
                />
                <circle className="bs-live" cx="66" cy="76" r="4" fill={C.ok} />
                <text
                  x="78"
                  y="80"
                  fontSize="10.5"
                  fontWeight="600"
                  fill="#e6fff3"
                >
                  {t.online}
                </text>
              </g>
              {rings.map((x, n) => {
                const a = 0.865 + n * 0.022;
                return (
                  <g key={x}>
                    <g data-o={`${a - 0.01} ${a + 0.01}`}>
                      <circle
                        cx={x}
                        cy="502"
                        r="21"
                        fill="none"
                        stroke="#ffffff"
                        strokeOpacity=".12"
                        strokeWidth="3"
                      />
                      <text
                        x={x}
                        y="546"
                        textAnchor="middle"
                        fontSize="9.5"
                        fill="#cfe0f7"
                      >
                        {t.checks[n]}
                      </text>
                    </g>
                    <circle
                      data-d={`${a} ${a + 0.045}`}
                      cx={x}
                      cy="502"
                      r="21"
                      fill="none"
                      stroke={C.ok}
                      strokeWidth="3"
                      strokeLinecap="round"
                      transform={`rotate(-90 ${x} 502)`}
                    />
                    <path
                      data-d={`${a + 0.035} ${a + 0.055}`}
                      d={`M${x - 7} 502l5 5 10-11`}
                      fill="none"
                      stroke="#ffffff"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </g>
                );
              })}

              {/* Drag size label */}
              <g data-ref="size" opacity="0">
                <rect
                  x="0"
                  y="-12"
                  width="76"
                  height="17"
                  rx="4"
                  fill="#5aa2ff"
                />
                <text
                  data-ref="size-text"
                  x="38"
                  y="0"
                  textAnchor="middle"
                  fontFamily={MONO}
                  fontSize="8.5"
                  fill="#ffffff"
                >
                  0 × 0
                </text>
              </g>

              {/* Click feedback */}
              <circle
                data-o=".05 .055 .062 .075"
                cx="140"
                cy="90"
                r="14"
                fill="none"
                stroke="#ffffff"
                strokeOpacity=".7"
              />
              <circle
                data-o=".946 .952 .962 .985"
                cx="140"
                cy="304"
                r="16"
                fill="none"
                stroke="#ffffff"
                strokeOpacity=".8"
              />

              {/* Cursor */}
              <g data-ref="cursor" transform="translate(900 620)">
                <path
                  d="M0 0v19l5.2-4.8 3.4 7.6 3.4-1.5-3.4-7.4h7.2z"
                  fill="#ffffff"
                  stroke={C.ink}
                  strokeWidth="1.2"
                  strokeLinejoin="round"
                />
                <rect
                  x="17"
                  y="20"
                  width="34"
                  height="15"
                  rx="7.5"
                  fill="#386fbb"
                />
                <text
                  x="34"
                  y="30.5"
                  textAnchor="middle"
                  fontSize="8"
                  fontWeight="700"
                  fill="#ffffff"
                >
                  CLM
                </text>
              </g>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
