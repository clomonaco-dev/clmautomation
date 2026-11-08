"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { href, type Locale } from "@/lib/routes";

/*
 * "More than a business card": a pinned section that scrolls horizontally.
 * Each panel owns an SVG scene driven by its local progress (0–1):
 *   data-o="a b [c d]"   opacity (+ data-y offset)
 *   data-d="a b"         stroke drawing
 *   data-tw="a b" data-to="attr:from:to;…"   attribute tween
 *     (tx/ty/s are combined into the transform attribute)
 */

const slides = {
  it: [
    [
      "01 / PRESENTATI BENE",
      "Il primo incontro con un cliente può essere una pagina.",
      "In pochi secondi il tuo sito deve far capire cosa fai, per chi lo fai e perché vale la pena contattarti.",
      [
        "Servizi spiegati con chiarezza",
        "Immagini e testi in equilibrio",
        "Contatti sempre facili da trovare",
      ],
    ],
    [
      "02 / ACCOGLI OGNI VISITATORE",
      "Dal grande schermo al telefono in tasca.",
      "Chi ti cerca può essere in movimento. Il layout si riorganizza per ogni schermo, senza perdere chiarezza.",
      [
        "Layout che si adattano allo schermo",
        "Percorsi brevi verso le informazioni",
        "Attenzione a velocità e leggibilità",
      ],
    ],
    [
      "03 / COSTRUIAMO INSIEME",
      "Sai sempre a che punto siamo.",
      "Analisi, design e sviluppo procedono per tappe condivise: puoi seguire il lavoro e provare il sito prima della consegna.",
      [
        "Analisi e preventivo",
        "Proposta visiva e sviluppo",
        "Verifica, pubblicazione e supporto",
      ],
    ],
    [
      "04 / IL PROSSIMO PASSO",
      "Dalla curiosità alla richiesta, in un gesto.",
      "Moduli semplici e contatti in evidenza trasformano una visita in una conversazione. Il prossimo messaggio potrebbe essere il tuo.",
      [
        "Moduli chiari anche da smartphone",
        "Email, telefono e WhatsApp a portata",
        "Richieste ordinate, risposte rapide",
      ],
    ],
  ],
  en: [
    [
      "01 / MAKE AN INTRODUCTION",
      "Your first client meeting could be a page.",
      "Within seconds, your website should explain what you do, who you help and why to get in touch.",
      [
        "Clearly explained services",
        "Balanced images and copy",
        "Easy-to-find contact details",
      ],
    ],
    [
      "02 / WELCOME EVERY VISITOR",
      "From a large screen to the phone in a pocket.",
      "Your next visitor may be on the move. The layout reorganises itself for every screen without losing clarity.",
      [
        "Layouts that adapt to the screen",
        "Direct paths to useful information",
        "Care for speed and readability",
      ],
    ],
    [
      "03 / BUILD TOGETHER",
      "You always know where we are.",
      "Discovery, design and development move through shared milestones: follow the work and try the website before handover.",
      [
        "Discovery and quote",
        "Design direction and development",
        "Review, launch and support",
      ],
    ],
    [
      "04 / YOUR NEXT STEP",
      "From curiosity to enquiry, in one gesture.",
      "Simple forms and visible contact details turn a visit into a conversation. The next message could be yours.",
      [
        "Clear forms, also on phones",
        "Email, phone and WhatsApp in reach",
        "Organised requests, quick replies",
      ],
    ],
  ],
} as const;

const words = {
  it: {
    name: "Il tuo nome",
    role: "Consulente · Studio",
    h1: ["Il tuo lavoro,", "spiegato bene."],
    contact: "Contattaci",
    more: "Più di un biglietto da visita",
    cols: ["Analisi", "Design", "Sviluppo"],
    tasks: ["Obiettivi", "Wireframe", "Palette", "Pagine", "Test"],
    approved: "Approvato",
    req: "Nuova richiesta",
    reqText: "Vorrei un nuovo sito…",
    send: "Invia",
    desktop: "Desktop",
    mobile: "Mobile",
    progress: "Avanzamento",
  },
  en: {
    name: "Your name",
    role: "Consultant · Studio",
    h1: ["Your work,", "clearly explained."],
    contact: "Contact us",
    more: "More than a business card",
    cols: ["Discovery", "Design", "Build"],
    tasks: ["Goals", "Wireframe", "Palette", "Pages", "Testing"],
    approved: "Approved",
    req: "New enquiry",
    reqText: "I’d like a new website…",
    send: "Send",
    desktop: "Desktop",
    mobile: "Mobile",
    progress: "Progress",
  },
};

const INK = "#19283f";
const BLUE = "#386fbb";
const SOFT = "#c9ddfb";
const LINE = "#dce3ed";
const OK = "#3fb37f";
const MONO = "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";

const clamp = (v: number) => Math.min(1, Math.max(0, v));
const seg = (p: number, a: number, b: number) => clamp((p - a) / (b - a));
const ease = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const out = (t: number) => 1 - Math.pow(1 - t, 3);

type Track = {
  el: SVGElement;
  kind: "o" | "d" | "tw";
  v: number[];
  y: number;
  len?: number;
  to?: [string, number, number][];
};

function parse(svg: SVGSVGElement): Track[] {
  const list: Track[] = [];
  svg
    .querySelectorAll<SVGElement>("[data-o],[data-d],[data-tw]")
    .forEach((el) => {
      const d = el.dataset;
      const n = (s?: string) => (s ? s.split(" ").map(Number) : []);
      const y = Number(d.y || 0);
      if (d.o) list.push({ el, kind: "o", v: n(d.o), y });
      if (d.d) {
        const len = (el as unknown as SVGGeometryElement).getTotalLength();
        el.style.strokeDasharray = `${len} ${len}`;
        list.push({ el, kind: "d", v: n(d.d), y, len });
      }
      if (d.tw)
        list.push({
          el,
          kind: "tw",
          v: n(d.tw),
          y,
          to: d.to!.split(";").map((part) => {
            const [k, a, b] = part.split(":");
            return [k, Number(a), Number(b)] as [string, number, number];
          }),
        });
    });
  return list;
}

function apply(tracks: Track[], t: number) {
  for (const tr of tracks) {
    const [a, b, c, d] = tr.v;
    if (tr.kind === "o") {
      const vin = out(seg(t, a, b));
      const vout = c === undefined ? 0 : out(seg(t, c, d));
      tr.el.style.opacity = String(vin * (1 - vout));
      if (tr.y) tr.el.style.transform = `translateY(${(1 - vin) * tr.y}px)`;
    } else if (tr.kind === "d") {
      tr.el.style.strokeDashoffset = String(tr.len! * (1 - out(seg(t, a, b))));
    } else {
      const k = ease(seg(t, a, b));
      let tx = 0;
      let ty = 0;
      let s = 1;
      let hasT = false;
      for (const [key, from, to] of tr.to!) {
        const val = from + (to - from) * k;
        if (key === "tx") ((tx = val), (hasT = true));
        else if (key === "ty") ((ty = val), (hasT = true));
        else if (key === "s") ((s = val), (hasT = true));
        else tr.el.setAttribute(key, val.toFixed(2));
      }
      if (hasT)
        tr.el.setAttribute("transform", `translate(${tx} ${ty}) scale(${s})`);
    }
  }
}

/* ---------- Scenes (viewBox 0 0 520 400) ---------- */

function CardScene({ w }: { w: (typeof words)["it"] }) {
  const to = "x:150:30;y:135:34;width:220:460;height:130:320;rx:12:16";
  return (
    <>
      <rect
        data-tw=".12 .55"
        data-to={to}
        x="150"
        y="135"
        width="220"
        height="130"
        rx="12"
        fill={INK}
        filter="url(#pr-shadow)"
      />
      <rect
        data-o=".2 .38"
        data-tw=".12 .55"
        data-to={to}
        x="150"
        y="135"
        width="220"
        height="130"
        rx="12"
        fill="#fff"
      />
      <g data-o="-1 -1 .06 .18">
        <text
          x="172"
          y="176"
          fontSize="22"
          fontWeight="700"
          letterSpacing="-1.4"
          fill="#fff"
        >
          clm<tspan fill="#8fb6f0">.</tspan>
        </text>
        <text x="172" y="214" fontSize="12.5" fontWeight="600" fill="#fff">
          {w.name}
        </text>
        <text x="172" y="231" fontSize="9.5" fill="#a8c9f6">
          {w.role}
        </text>
        <rect x="290" y="210" width="60" height="5" rx="2.5" fill="#ffffff55" />
        <rect x="300" y="222" width="50" height="5" rx="2.5" fill="#ffffff55" />
        <rect x="310" y="234" width="40" height="5" rx="2.5" fill="#ffffff55" />
      </g>
      <g data-o=".5 .58">
        <path
          d="M46 34h428a16 16 0 0 1 16 16v8H30v-8a16 16 0 0 1 16-16z"
          fill="#eef3fa"
        />
        {[48, 60, 72].map((x) => (
          <circle key={x} cx={x} cy="46" r="3.5" fill="#c3d0e2" />
        ))}
        <rect x="200" y="39" width="120" height="13" rx="6.5" fill="#fff" />
      </g>
      <g data-o=".55 .63" data-y="10">
        <text
          x="56"
          y="92"
          fontSize="15"
          fontWeight="700"
          letterSpacing="-.7"
          fill={INK}
        >
          studio<tspan fill={BLUE}>.</tspan>
        </text>
        {[0, 1, 2].map((i) => (
          <rect
            key={i}
            x={260 + i * 46}
            y="83"
            width="36"
            height="6"
            rx="3"
            fill={LINE}
          />
        ))}
        <rect x="400" y="76" width="74" height="20" rx="10" fill={INK} />
        <text
          x="437"
          y="89.5"
          textAnchor="middle"
          fontSize="8.5"
          fontWeight="600"
          fill="#fff"
        >
          {w.contact}
        </text>
      </g>
      <g data-o=".6 .7" data-y="14">
        <text
          x="56"
          y="142"
          fontSize="25"
          fontWeight="600"
          letterSpacing="-1.2"
          fill={INK}
        >
          {w.h1[0]}
        </text>
        <text
          x="56"
          y="172"
          fontSize="25"
          fontFamily="Georgia, serif"
          fontStyle="italic"
          fill={BLUE}
        >
          {w.h1[1]}
        </text>
        <rect x="56" y="188" width="170" height="6" rx="3" fill={LINE} />
        <rect x="56" y="200" width="130" height="6" rx="3" fill={LINE} />
        <rect x="56" y="218" width="96" height="24" rx="12" fill={INK} />
      </g>
      <g data-o=".64 .74" data-y="14">
        <rect x="280" y="114" width="194" height="128" rx="10" fill="#1f3c64" />
        <circle
          cx="400"
          cy="178"
          r="36"
          fill="none"
          stroke="#a8c9f6"
          strokeWidth="13"
        />
      </g>
      {[56, 202, 348].map((x, i) => (
        <g key={x} data-o={`${0.7 + i * 0.04} ${0.8 + i * 0.04}`} data-y="12">
          <rect
            x={x}
            y="260"
            width="126"
            height="76"
            rx="9"
            fill="#f3f7fc"
            stroke={LINE}
          />
          <rect x={x + 12} y="272" width="20" height="20" rx="6" fill={SOFT} />
          <rect
            x={x + 12}
            y="304"
            width="80"
            height="6"
            rx="3"
            fill={INK}
            opacity=".8"
          />
          <rect
            x={x + 12}
            y="316"
            width="60"
            height="5"
            rx="2.5"
            fill="#b9c8dc"
          />
        </g>
      ))}
      <g data-o=".86 .94" data-y="10">
        <rect x="150" y="364" width="220" height="28" rx="14" fill={INK} />
        <circle cx="170" cy="378" r="8" fill={OK} />
        <path
          d="M166 378l3 3 6-6.5"
          fill="none"
          stroke="#fff"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <text x="186" y="382" fontSize="10.5" fontWeight="600" fill="#fff">
          {w.more}
        </text>
      </g>
    </>
  );
}

function ResponsiveScene({ w }: { w: (typeof words)["it"] }) {
  const T = ".2 .62";
  return (
    <>
      <rect
        data-tw={T}
        data-to="x:30:180;y:40:20;width:460:160;height:300:340;rx:14:24"
        x="30"
        y="40"
        width="460"
        height="300"
        rx="14"
        fill="#fff"
        stroke="#c3d0e2"
        strokeWidth="1.5"
        filter="url(#pr-shadow)"
      />
      <rect
        data-tw={T}
        data-to="x:30:238;y:40:28;width:460:44;height:18:7;rx:8:3.5"
        x="30"
        y="40"
        width="460"
        height="18"
        rx="8"
        fill="#eef3fa"
      />
      <rect
        data-tw={T}
        data-to="x:52:196;y:74:48;width:44:40"
        x="52"
        y="74"
        width="44"
        height="9"
        rx="3"
        fill={INK}
      />
      <rect
        data-tw={T}
        data-to="x:418:310;y:70:44;width:52:16;height:18:14"
        x="418"
        y="70"
        width="52"
        height="18"
        rx="7"
        fill={INK}
      />
      <rect
        data-tw={T}
        data-to="x:52:196;y:110:76;width:180:110"
        x="52"
        y="110"
        width="180"
        height="16"
        rx="4"
        fill={INK}
      />
      <rect
        data-tw={T}
        data-to="x:52:196;y:132:98;width:140:84"
        x="52"
        y="132"
        width="140"
        height="16"
        rx="4"
        fill={BLUE}
      />
      <rect
        data-tw={T}
        data-to="x:52:196;y:160:122;width:160:120"
        x="52"
        y="160"
        width="160"
        height="6"
        rx="3"
        fill={LINE}
      />
      <rect
        data-tw={T}
        data-to="x:52:196;y:184:136;width:92:70"
        x="52"
        y="184"
        width="92"
        height="22"
        rx="11"
        fill={INK}
      />
      <rect
        data-tw={T}
        data-to="x:262:196;y:100:168;width:206:128;height:120:72"
        x="262"
        y="100"
        width="206"
        height="120"
        rx="10"
        fill="#1f3c64"
      />
      {[0, 1, 2].map((i) => (
        <rect
          key={i}
          data-tw={T}
          data-to={`x:${52 + i * 142}:196;y:240:${252 + i * 34};width:132:128;height:78:26`}
          x={52 + i * 142}
          y="240"
          width="132"
          height="78"
          rx="9"
          fill="#f3f7fc"
          stroke={LINE}
        />
      ))}
      <g fontFamily={MONO} fontSize="10" fontWeight="700">
        <g data-o="-1 -1 .3 .4">
          <rect x="210" y="356" width="100" height="24" rx="12" fill={INK} />
          <text x="260" y="372" textAnchor="middle" fill="#fff">
            {w.desktop} · 1440
          </text>
        </g>
        <g data-o=".55 .65">
          <rect x="210" y="368" width="100" height="24" rx="12" fill={INK} />
          <text x="260" y="384" textAnchor="middle" fill="#fff">
            {w.mobile} · 390
          </text>
        </g>
      </g>
      {[
        [40, 90],
        [470, 120],
        [60, 300],
        [460, 290],
      ].map(([x, y], i) => (
        <g key={i} data-o={`${0.62 + i * 0.06} ${0.72 + i * 0.06}`}>
          <g
            data-tw={`${0.62 + i * 0.06} ${0.8 + i * 0.06}`}
            data-to={`tx:${x}:${x < 260 ? x + 60 : x - 60};ty:${y}:${y}`}
            transform={`translate(${x} ${y})`}
          >
            <circle r="15" fill={[SOFT, "#d7ecdf", "#f0d9b5", SOFT][i]} />
            <circle cy="-4" r="5" fill={INK} />
            <path d="M-8 8a8 6 0 0 1 16 0" fill={INK} />
          </g>
        </g>
      ))}
      <circle
        className="pr-ping"
        data-o=".85 .9"
        cx="236"
        cy="147"
        r="14"
        fill="none"
        stroke={BLUE}
        strokeWidth="2"
      />
    </>
  );
}

function BoardScene({ w }: { w: (typeof words)["it"] }) {
  const cols = [40, 200, 360];
  return (
    <>
      <rect
        x="20"
        y="20"
        width="480"
        height="330"
        rx="16"
        fill="#fff"
        stroke={LINE}
        filter="url(#pr-shadow)"
      />
      {cols.map((x, i) => (
        <g key={x}>
          <rect x={x} y="44" width="140" height="260" rx="10" fill="#f4f7fc" />
          <circle cx={x + 16} cy="62" r="5" fill={[SOFT, "#f0c27b", OK][i]} />
          <text x={x + 28} y="66" fontSize="11" fontWeight="700" fill={INK}>
            {w.cols[i]}
          </text>
          <text
            x={x + 128}
            y="66"
            textAnchor="end"
            fontFamily={MONO}
            fontSize="9"
            fill="#8a97a8"
          >
            0{i + 1}
          </text>
        </g>
      ))}
      {[
        [0, ".15 .45", "ty:0:0;tx:0:320", 82],
        [1, ".3 .6", "ty:0:0;tx:0:160", 132],
        [2, ".45 .75", "ty:0:-50;tx:0:320", 182],
        [3, ".6 .88", "ty:0:-50;tx:0:160", 232],
      ].map(([i, tw, to, y]) => (
        <g
          key={i as number}
          data-tw={tw as string}
          data-to={to as string}
          transform="translate(0 0)"
        >
          <rect
            x="50"
            y={y as number}
            width="120"
            height="40"
            rx="8"
            fill="#fff"
            stroke={LINE}
          />
          <rect
            x="60"
            y={(y as number) + 10}
            width="8"
            height="20"
            rx="3"
            fill={[BLUE, "#f0c27b", "#c9a7f5", OK][i as number]}
          />
          <text
            x="76"
            y={(y as number) + 19}
            fontSize="9.5"
            fontWeight="600"
            fill={INK}
          >
            {w.tasks[i as number]}
          </text>
          <rect
            x="76"
            y={(y as number) + 25}
            width="56"
            height="4"
            rx="2"
            fill="#b9c8dc"
          />
        </g>
      ))}
      <g>
        <rect
          x="50"
          y="282"
          width="120"
          height="14"
          rx="7"
          fill="none"
          stroke="#c3d0e2"
          strokeDasharray="3 4"
        />
      </g>
      <text x="40" y="330" fontFamily={MONO} fontSize="9" fill="#8a97a8">
        {w.progress}
      </text>
      <rect x="120" y="322" width="360" height="8" rx="4" fill="#eef3fa" />
      <rect
        data-tw=".1 .9"
        data-to="width:0:360"
        x="120"
        y="322"
        width="0"
        height="8"
        rx="4"
        fill={BLUE}
      />
      <g data-o=".78 .86" data-y="10">
        <rect x="300" y="248" width="180" height="40" rx="12" fill={INK} />
        <circle cx="322" cy="268" r="9" fill={OK} />
        <path
          d="M317.5 268l3 3 6.5-7"
          fill="none"
          stroke="#fff"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <text x="340" y="272" fontSize="11" fontWeight="600" fill="#fff">
          {w.approved}
        </text>
      </g>
      {[0, 1].map((i) => (
        <g key={i} data-o={`${0.45 + i * 0.25} ${0.5 + i * 0.25}`}>
          <circle cx={168 + i * 160} cy="58" r="9" fill={OK} />
          <path
            d={`M${163.5 + i * 160} 58l3 3 6.5-7`}
            fill="none"
            stroke="#fff"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      ))}
    </>
  );
}

function ContactScene({ w }: { w: (typeof words)["it"] }) {
  const flight = "M210 300C280 300 300 160 380 130";
  return (
    <>
      <rect
        x="60"
        y="24"
        width="190"
        height="352"
        rx="26"
        fill="#fff"
        stroke="#c3d0e2"
        strokeWidth="1.5"
        filter="url(#pr-shadow)"
      />
      <rect x="130" y="34" width="50" height="7" rx="3.5" fill={INK} />
      <text
        x="82"
        y="78"
        fontSize="13"
        fontWeight="700"
        letterSpacing="-.5"
        fill={INK}
      >
        studio<tspan fill={BLUE}>.</tspan>
      </text>
      {[100, 150].map((y, i) => (
        <g key={y}>
          <rect
            x="82"
            y={y}
            width="146"
            height="34"
            rx="8"
            fill="#f4f7fc"
            stroke={LINE}
          />
          <rect
            data-tw={`${0.1 + i * 0.12} ${0.22 + i * 0.12}`}
            data-to={`width:0:${[70, 104][i]}`}
            x="94"
            y={y + 15}
            width="0"
            height="5"
            rx="2.5"
            fill={INK}
          />
        </g>
      ))}
      <rect
        x="82"
        y="200"
        width="146"
        height="78"
        rx="8"
        fill="#f4f7fc"
        stroke={LINE}
      />
      <rect
        data-tw=".34 .46"
        data-to="width:0:118"
        x="94"
        y="214"
        width="0"
        height="5"
        rx="2.5"
        fill={INK}
      />
      <rect
        data-tw=".44 .54"
        data-to="width:0:90"
        x="94"
        y="226"
        width="0"
        height="5"
        rx="2.5"
        fill={INK}
      />
      <rect
        data-tw=".52 .6"
        data-to="width:0:60"
        x="94"
        y="238"
        width="0"
        height="5"
        rx="2.5"
        fill={INK}
      />
      <rect x="82" y="290" width="146" height="34" rx="17" fill={INK} />
      <rect
        data-o=".6 .64 .7 .76"
        x="82"
        y="290"
        width="146"
        height="34"
        rx="17"
        fill={BLUE}
      />
      <text
        x="155"
        y="311"
        textAnchor="middle"
        fontSize="11"
        fontWeight="700"
        fill="#fff"
      >
        {w.send} ↗
      </text>
      <path
        data-d=".62 .8"
        d={flight}
        fill="none"
        stroke="#9fbbe0"
        strokeWidth="1.6"
      />
      <g data-o=".62 .66 .8 .84">
        <g data-tw=".62 .82" data-to="tx:210:380;ty:300:130">
          <path d="M-11 -8L13 0-11 8-6 0z" fill={INK} transform="rotate(-35)" />
        </g>
      </g>
      <g data-o=".8 .88" data-y="14">
        <rect
          x="290"
          y="80"
          width="210"
          height="100"
          rx="14"
          fill={INK}
          filter="url(#pr-shadow)"
        />
        <circle cx="318" cy="110" r="13" fill={BLUE} />
        <path
          d="M311 106h14v9h-14zM311 106l7 5 7-5"
          fill="none"
          stroke="#fff"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
        <text x="340" y="108" fontSize="12" fontWeight="700" fill="#fff">
          {w.req}
        </text>
        <text x="340" y="124" fontSize="9.5" fill="#a8c9f6">
          {w.reqText}
        </text>
        <rect
          x="306"
          y="144"
          width="120"
          height="5"
          rx="2.5"
          fill="#ffffff33"
        />
        <rect x="306" y="156" width="84" height="5" rx="2.5" fill="#ffffff33" />
        <circle cx="478" cy="98" r="9" fill={OK} />
        <path
          d="M473.5 98l3 3 6.5-7"
          fill="none"
          stroke="#fff"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <circle
        className="pr-ping"
        data-o=".88 .92"
        cx="478"
        cy="98"
        r="9"
        fill="none"
        stroke={OK}
        strokeWidth="2"
      />
      <g
        data-o=".9 .96"
        data-y="10"
        fontFamily={MONO}
        fontSize="10"
        fill="#8a97a8"
      >
        <text x="300" y="214">
          → email · WhatsApp · tel
        </text>
      </g>
    </>
  );
}

export function Presentation({ locale }: { locale: Locale }) {
  const en = locale === "en";
  const w = words[locale];
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const stage = root.querySelector<HTMLElement>(".pr-stage")!;
    const track = root.querySelector<HTMLElement>(".pr-track")!;
    const bar = root.querySelector<HTMLElement>(".pr-bar > i");
    const counter = root.querySelector<HTMLElement>(".pr-counter");
    const panels = [...root.querySelectorAll<HTMLElement>(".pr-panel")];
    const scenes = panels.map((panel) => parse(panel.querySelector("svg")!));
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const n = panels.length;
    let target = 0;
    let current = 0;
    let raf = 0;
    let last = -1;

    const render = (p: number) => {
      const q = clamp((p - 0.1) / 0.82);
      track.style.transform = `translate3d(${-q * (100 - 100 / n)}%,0,0)`;
      if (bar) bar.style.transform = `scaleX(${p})`;
      panels.forEach((panel, i) => {
        const center = 0.1 + (0.82 * i) / (n - 1);
        const t =
          i === 0 ? clamp(p / 0.12) : clamp((p - (center - 0.2)) / 0.24);
        apply(scenes[i], t);
        panel.classList.toggle("is-current", Math.round(q * (n - 1)) === i);
      });
      const idx = Math.round(q * (n - 1));
      if (idx !== last && counter) {
        last = idx;
        counter.textContent = `0${idx + 1} / 0${n}`;
      }
    };
    const measure = () => {
      const r = root.getBoundingClientRect();
      const top = parseFloat(getComputedStyle(stage).top) || 0;
      const range = r.height - stage.offsetHeight;
      return range > 0 ? clamp((top - r.top) / range) : 1;
    };
    const tick = () => {
      current += (target - current) * 0.12;
      if (Math.abs(target - current) < 0.0004) current = target;
      render(current);
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
      if (media.matches) {
        track.style.transform = "";
        scenes.forEach((s) => apply(s, 1));
        panels.forEach((p) => p.classList.add("is-current"));
      } else {
        current = target = measure();
        render(current);
      }
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
    };
  }, [locale]);

  const scenes = [CardScene, ResponsiveScene, BoardScene, ContactScene];

  return (
    <section
      ref={rootRef}
      className="presentation-x"
      aria-label={en ? "Meet CLM Automation" : "Scopri CLM Automation"}
    >
      <svg className="pr-defs" aria-hidden="true" focusable="false">
        <defs>
          <filter id="pr-shadow" x="-20%" y="-20%" width="140%" height="150%">
            <feDropShadow
              dx="0"
              dy="16"
              stdDeviation="16"
              floodColor="#203e6c"
              floodOpacity=".16"
            />
          </filter>
        </defs>
      </svg>
      <div className="pr-stage">
        <div className="shell pr-head">
          <div>
            <p className="eyebrow">CLM AUTOMATION / DIGITAL STUDIO</p>
            <h2>
              {en
                ? "More than an online business card."
                : "Più di un biglietto da visita online."}
            </h2>
          </div>
          <div className="pr-meta" aria-hidden="true">
            <span className="pr-counter">01 / 04</span>
            <span className="pr-bar">
              <i />
            </span>
          </div>
        </div>
        <div className="pr-viewport">
          <div className="pr-track">
            {slides[locale].map((s, i) => {
              const Scene = scenes[i];
              return (
                <article className="pr-panel" key={s[0]}>
                  <div className="shell pr-panel-inner">
                    <div className="pr-copy">
                      <p className="eyebrow">{s[0]}</p>
                      <h3>{s[1]}</h3>
                      <p className="pr-text">{s[2]}</p>
                      <ul>
                        {s[3].map((f) => (
                          <li key={f}>
                            <span aria-hidden="true">✓</span> {f}
                          </li>
                        ))}
                      </ul>
                      <Link
                        className="text-link"
                        href={href(locale, i === 3 ? "contatti" : "metodo")}
                      >
                        {en
                          ? i === 3
                            ? "Tell me about your project"
                            : "Discover the process"
                          : i === 3
                            ? "Raccontami il tuo progetto"
                            : "Scopri come lavoriamo"}
                        <span aria-hidden="true">↗</span>
                      </Link>
                    </div>
                    <div className="pr-scene" aria-hidden="true">
                      <svg viewBox="0 0 520 400">
                        <Scene w={w} />
                      </svg>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
