import type { CSSProperties } from "react";
import type { Locale } from "@/lib/routes";
import type { SceneKey } from "@/lib/projects";

/*
 * Looping SVG mock-ups for each project type (CSS-driven).
 * Animations run only while `.ps` has `.is-live` (set by Motion.tsx).
 */

const INK = "#19283f";
const BLUE = "#386fbb";
const SOFT = "#c9ddfb";
const LINE = "#dce3ed";
const OK = "#3fb37f";
const MONO = "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
const v = (o: Record<string, string | number>) => o as CSSProperties;

const copy = {
  it: {
    order: "Ordine ricevuto",
    booked: "Prenotazione confermata",
    area: "Area riservata",
    cta: "Iscriviti",
    sent: "Richiesta inviata",
    before: "Prima",
    after: "Dopo",
    old: "Benvenuti nel sito",
    contact: "Contattaci",
    days: ["L", "M", "M", "G", "V", "S", "D"],
  },
  en: {
    order: "Order received",
    booked: "Booking confirmed",
    area: "Private area",
    cta: "Sign up",
    sent: "Request sent",
    before: "Before",
    after: "After",
    old: "Welcome to our site",
    contact: "Contact us",
    days: ["M", "T", "W", "T", "F", "S", "S"],
  },
};

function Chrome({
  x,
  y,
  w,
  h,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
}) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="12" fill="#fff" />
      <path
        d={`M${x + 12} ${y}h${w - 24}a12 12 0 0 1 12 12v8H${x}v-8a12 12 0 0 1 12-12z`}
        fill="#eef3fa"
      />
      {[0, 1, 2].map((i) => (
        <circle key={i} cx={x + 14 + i * 10} cy={y + 10} r="3" fill="#c3d0e2" />
      ))}
      <rect
        x={x + w / 2 - 50}
        y={y + 5}
        width="100"
        height="10"
        rx="5"
        fill="#fff"
      />
    </g>
  );
}

function Check({ x, y, r = 9 }: { x: number; y: number; r?: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill={OK} />
      <path
        d={`M${x - r * 0.45} ${y}l${r * 0.32} ${r * 0.32} ${r * 0.62}-${r * 0.68}`}
        fill="none"
        stroke="#fff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  );
}

function Vetrina({ t }: { t: (typeof copy)["it"] }) {
  const page = (
    <g>
      <rect x="0" y="0" width="256" height="18" fill="#fff" />
      <text
        x="0"
        y="13"
        fontSize="11"
        fontWeight="700"
        letterSpacing="-.5"
        fill={INK}
      >
        studio<tspan fill={BLUE}>.</tspan>
      </text>
      <rect x="196" y="3" width="60" height="14" rx="7" fill={INK} />
      <text
        x="226"
        y="13"
        textAnchor="middle"
        fontSize="6.5"
        fontWeight="600"
        fill="#fff"
      >
        {t.contact}
      </text>
      <rect x="0" y="34" width="120" height="13" rx="3" fill={INK} />
      <rect x="0" y="52" width="92" height="13" rx="3" fill={BLUE} />
      <rect x="0" y="74" width="110" height="5" rx="2.5" fill={LINE} />
      <rect x="0" y="84" width="86" height="5" rx="2.5" fill={LINE} />
      <rect x="0" y="100" width="64" height="16" rx="8" fill={INK} />
      <rect x="136" y="30" width="120" height="90" rx="8" fill="#1f3c64" />
      <circle
        cx="210"
        cy="75"
        r="24"
        fill="none"
        stroke="#a8c9f6"
        strokeWidth="9"
      />
      {[0, 88, 176].map((x) => (
        <g key={x}>
          <rect
            x={x}
            y="136"
            width="80"
            height="62"
            rx="7"
            fill="#f3f7fc"
            stroke={LINE}
          />
          <rect x={x + 10} y="146" width="16" height="16" rx="4" fill={SOFT} />
          <rect
            x={x + 10}
            y="172"
            width="50"
            height="5"
            rx="2.5"
            fill="#b9c8dc"
          />
          <rect x={x + 10} y="182" width="36" height="5" rx="2.5" fill={LINE} />
        </g>
      ))}
      <rect x="0" y="214" width="256" height="60" rx="8" fill="#eaf1fb" />
      <rect x="14" y="230" width="110" height="9" rx="3" fill={INK} />
      <rect x="14" y="246" width="150" height="5" rx="2.5" fill="#b9c8dc" />
      <rect x="0" y="286" width="256" height="30" rx="6" fill={INK} />
    </g>
  );
  return (
    <>
      <defs>
        <clipPath id="ps-v-clip">
          <rect x="24" y="44" width="256" height="166" />
        </clipPath>
        <clipPath id="ps-v-phone">
          <rect x="304" y="82" width="74" height="132" rx="4" />
        </clipPath>
      </defs>
      <Chrome x={12} y={20} w={280} h={198} />
      <g clipPath="url(#ps-v-clip)">
        <g className="ps-scroll">
          <g transform="translate(24 48)">{page}</g>
        </g>
      </g>
      <rect
        x="296"
        y="64"
        width="90"
        height="166"
        rx="16"
        fill="#fff"
        stroke="#c3d0e2"
      />
      <rect x="328" y="70" width="26" height="5" rx="2.5" fill={INK} />
      <g clipPath="url(#ps-v-phone)">
        <g className="ps-scroll" style={v({ animationDelay: "-1.5s" })}>
          <g transform="translate(306 86) scale(.27)">{page}</g>
          <g transform="translate(306 86)">
            <rect x="0" y="0" width="34" height="6" rx="3" fill={INK} />
            <rect x="0" y="14" width="70" height="9" rx="3" fill={INK} />
            <rect x="0" y="27" width="52" height="9" rx="3" fill={BLUE} />
            <rect x="0" y="44" width="70" height="46" rx="6" fill="#1f3c64" />
            <circle
              cx="35"
              cy="67"
              r="13"
              fill="none"
              stroke="#a8c9f6"
              strokeWidth="5"
            />
            <rect
              x="0"
              y="98"
              width="70"
              height="30"
              rx="5"
              fill="#f3f7fc"
              stroke={LINE}
            />
            <rect
              x="0"
              y="134"
              width="70"
              height="30"
              rx="5"
              fill="#f3f7fc"
              stroke={LINE}
            />
            <rect x="0" y="172" width="44" height="12" rx="6" fill={INK} />
          </g>
        </g>
      </g>
      <g className="ps-cursor">
        <path
          d="M0 0v15l4-3.8 2.8 6.2 2.6-1.2-2.8-6h5.8z"
          fill="#fff"
          stroke={INK}
          strokeWidth="1.1"
          strokeLinejoin="round"
        />
      </g>
      <circle
        className="ps-click"
        cx="250"
        cy="58"
        r="9"
        fill="none"
        stroke={BLUE}
        strokeWidth="1.5"
      />
    </>
  );
}

function Shop({ t }: { t: (typeof copy)["it"] }) {
  const products = [
    [34, "#f0d9b5", "#c9905a"],
    [152, "#cfe0f7", "#386fbb"],
    [270, "#d7ecdf", "#3fb37f"],
  ] as const;
  return (
    <>
      <Chrome x={12} y={14} w={376} h={226} />
      <text
        x="30"
        y="52"
        fontSize="13"
        fontWeight="700"
        letterSpacing="-.5"
        fill={INK}
      >
        shop<tspan fill={BLUE}>.</tspan>
      </text>
      {[0, 1, 2].map((i) => (
        <rect
          key={i}
          x={150 + i * 46}
          y="44"
          width="36"
          height="6"
          rx="3"
          fill={LINE}
        />
      ))}
      <g transform="translate(348 46)">
        <path
          d="M-11 -8h3l3 12h13l3-9H-6"
          fill="none"
          stroke={INK}
          strokeWidth="1.8"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <circle cx="-3" cy="8" r="1.8" fill={INK} />
        <circle cx="7" cy="8" r="1.8" fill={INK} />
        <g className="ps-bump">
          <circle cx="11" cy="-9" r="7.5" fill={BLUE} />
          {["1", "2", "3"].map((n, i) => (
            <text
              key={n}
              className={`ps-count ps-count-${i}`}
              x="11"
              y="-6"
              textAnchor="middle"
              fontSize="8.5"
              fontWeight="700"
              fill="#fff"
            >
              {n}
            </text>
          ))}
        </g>
      </g>
      {products.map(([x, bg, fg], i) => (
        <g key={x}>
          <rect
            x={x}
            y="66"
            width="98"
            height="154"
            rx="10"
            fill="#fff"
            stroke={LINE}
          />
          <rect x={x + 8} y="74" width="82" height="76" rx="7" fill={bg} />
          {i === 0 && <path d={`M${x + 32} 132h34l-5-30h-24z`} fill={fg} />}
          {i === 1 && <circle cx={x + 49} cy="112" r="22" fill={fg} />}
          {i === 2 && (
            <rect
              x={x + 30}
              y="94"
              width="38"
              height="38"
              rx="8"
              fill={fg}
              transform={`rotate(12 ${x + 49} 113)`}
            />
          )}
          <rect x={x + 8} y="160" width="60" height="6" rx="3" fill={INK} />
          <rect
            x={x + 8}
            y="172"
            width="38"
            height="5"
            rx="2.5"
            fill="#b9c8dc"
          />
          <rect
            className={`ps-add ps-add-${i}`}
            x={x + 8}
            y="188"
            width="82"
            height="22"
            rx="11"
            fill={INK}
          />
          <text
            x={x + 49}
            y="202"
            textAnchor="middle"
            fontSize="11"
            fontWeight="700"
            fill="#fff"
          >
            +
          </text>
          <circle
            className={`ps-fly ps-fly-${i}`}
            r="7"
            fill={fg}
            style={v({ "--sx": `${x + 49}px`, "--sy": "190px" })}
          />
        </g>
      ))}
      <g className="ps-toast">
        <rect x="236" y="196" width="140" height="32" rx="10" fill={INK} />
        <Check x={254} y={212} r={8} />
        <text x="268" y="216" fontSize="10" fontWeight="600" fill="#fff">
          {t.order}
        </text>
      </g>
    </>
  );
}

function Dashboard() {
  const bars = [52, 74, 40, 88, 62, 96, 70];
  return (
    <>
      <rect x="12" y="14" width="376" height="226" rx="12" fill="#fff" />
      <path
        d="M24 14h48v226H24a12 12 0 0 1-12-12V26a12 12 0 0 1 12-12z"
        fill={INK}
      />
      <circle cx="42" cy="36" r="9" fill={BLUE} />
      <rect
        className="ps-nav"
        x="22"
        y="58"
        width="40"
        height="18"
        rx="6"
        fill="#ffffff22"
      />
      {[0, 1, 2, 3, 4].map((i) => (
        <rect
          key={i}
          x="31"
          y={64 + i * 26}
          width="22"
          height="5"
          rx="2.5"
          fill="#ffffff66"
        />
      ))}
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect
            x={86 + i * 98}
            y="26"
            width="88"
            height="50"
            rx="9"
            fill="#f4f7fc"
            stroke={LINE}
          />
          <rect
            x={96 + i * 98}
            y="36"
            width="34"
            height="5"
            rx="2.5"
            fill="#b9c8dc"
          />
          <rect
            className="ps-kpi"
            style={v({ animationDelay: `${i * 0.4}s` })}
            x={96 + i * 98}
            y="48"
            width={[46, 38, 52][i]}
            height="13"
            rx="3"
            fill={i === 1 ? BLUE : INK}
          />
          <path
            className="ps-spark"
            style={v({ animationDelay: `${i * 0.5}s` })}
            pathLength={1}
            d={`M${150 + i * 98} 66l6-6 6 3 6-9 6 4`}
            fill="none"
            stroke={OK}
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </g>
      ))}
      <rect
        x="86"
        y="88"
        width="184"
        height="140"
        rx="10"
        fill="#f4f7fc"
        stroke={LINE}
      />
      {[0, 1, 2].map((i) => (
        <line
          key={i}
          x1="98"
          x2="258"
          y1={120 + i * 32}
          y2={120 + i * 32}
          stroke={LINE}
        />
      ))}
      {bars.map((h, i) => (
        <rect
          key={i}
          className="ps-bar"
          style={v({
            animationDelay: `${i * 0.18}s`,
            "--h": String(0.35 + (i % 3) * 0.2),
          })}
          x={102 + i * 22}
          y={216 - h}
          width="13"
          height={h}
          rx="3"
          fill={i === 5 ? BLUE : "#9fbbe0"}
        />
      ))}
      <path
        className="ps-line"
        pathLength={1}
        d="M100 170C130 150 150 176 180 140S230 118 258 104"
        fill="none"
        stroke={INK}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <rect
        x="280"
        y="88"
        width="96"
        height="140"
        rx="10"
        fill="#f4f7fc"
        stroke={LINE}
      />
      <rect
        className="ps-row"
        x="284"
        y="104"
        width="88"
        height="22"
        rx="5"
        fill={SOFT}
      />
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i}>
          <circle
            cx="296"
            cy={115 + i * 22}
            r="5"
            fill={["#f0c27b", BLUE, OK, "#c9a7f5", "#9fbbe0"][i]}
          />
          <rect
            x="306"
            y={110 + i * 22}
            width="40"
            height="4"
            rx="2"
            fill={INK}
            opacity=".75"
          />
          <rect
            x="306"
            y={118 + i * 22}
            width="26"
            height="3"
            rx="1.5"
            fill="#b9c8dc"
          />
        </g>
      ))}
    </>
  );
}

function WebApp({ t }: { t: (typeof copy)["it"] }) {
  return (
    <>
      <Chrome x={12} y={14} w={376} h={226} />
      <rect
        x="26"
        y="40"
        width="110"
        height="186"
        rx="10"
        fill="#f4f7fc"
        stroke={LINE}
      />
      <circle cx="81" cy="76" r="18" fill={SOFT} />
      <circle cx="81" cy="70" r="7" fill={INK} />
      <path d="M68 88a13 10 0 0 1 26 0" fill={INK} />
      <rect x="44" y="106" width="74" height="6" rx="3" fill={INK} />
      <rect x="54" y="117" width="54" height="5" rx="2.5" fill="#b9c8dc" />
      <g transform="translate(40 138)">
        <rect width="82" height="22" rx="6" fill="#fff" stroke={LINE} />
        <rect
          className="ps-type"
          x="8"
          y="9"
          width="44"
          height="4"
          rx="2"
          fill={INK}
        />
      </g>
      <g transform="translate(40 166)">
        <rect width="82" height="22" rx="6" fill="#fff" stroke={LINE} />
        <text
          className="ps-dots"
          x="9"
          y="15"
          fontSize="11"
          fill={INK}
          letterSpacing="2"
        >
          ••••••
        </text>
      </g>
      <g transform="translate(40 196)">
        <rect width="82" height="20" rx="10" fill={INK} />
        <path
          d="M37 6h8a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-8a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2zM38 6V4a3 3 0 0 1 6 0v2"
          fill="none"
          stroke="#fff"
          strokeWidth="1.3"
        />
      </g>
      <text x="148" y="54" fontSize="11" fontWeight="700" fill={INK}>
        {t.area}
      </text>
      <rect x="300" y="44" width="76" height="14" rx="7" fill={SOFT} />
      {t.days.map((d, i) => (
        <text
          key={i}
          x={162 + i * 31}
          y="78"
          textAnchor="middle"
          fontFamily={MONO}
          fontSize="8"
          fill="#8a97a8"
        >
          {d}
        </text>
      ))}
      {Array.from({ length: 28 }, (_, i) => {
        const x = 148 + (i % 7) * 31;
        const y = 86 + Math.floor(i / 7) * 34;
        const busy = [3, 9, 15, 22, 26].includes(i);
        return (
          <g key={i}>
            <rect
              x={x}
              y={y}
              width="28"
              height="30"
              rx="6"
              fill={busy ? "#eef3fa" : "#fff"}
              stroke={LINE}
            />
            <text
              x={x + 5}
              y={y + 10}
              fontFamily={MONO}
              fontSize="6.5"
              fill="#8a97a8"
            >
              {i + 1}
            </text>
            {busy && (
              <rect
                x={x + 5}
                y={y + 17}
                width="18"
                height="5"
                rx="2.5"
                fill="#b9c8dc"
              />
            )}
          </g>
        );
      })}
      <g className="ps-book">
        <rect x="272" y="120" width="28" height="30" rx="6" fill={BLUE} />
        <text x="277" y="130" fontFamily={MONO} fontSize="6.5" fill="#fff">
          12
        </text>
        <rect x="277" y="137" width="18" height="5" rx="2.5" fill="#fff" />
      </g>
      <circle
        className="ps-ripple"
        cx="286"
        cy="135"
        r="12"
        fill="none"
        stroke={BLUE}
        strokeWidth="1.5"
      />
      <g className="ps-toast">
        <rect x="214" y="196" width="162" height="32" rx="10" fill={INK} />
        <Check x={232} y={212} r={8} />
        <text x="246" y="216" fontSize="10" fontWeight="600" fill="#fff">
          {t.booked}
        </text>
      </g>
    </>
  );
}

function Landing({ t }: { t: (typeof copy)["it"] }) {
  const visitors = [
    [390, 30],
    [400, 120],
    [380, 220],
    [320, 250],
    [330, 10],
    [400, 70],
  ];
  return (
    <>
      <rect
        x="40"
        y="10"
        width="150"
        height="240"
        rx="16"
        fill="#fff"
        stroke="#c3d0e2"
      />
      <rect x="96" y="17" width="38" height="5" rx="2.5" fill={INK} />
      <rect x="54" y="34" width="122" height="78" rx="9" fill="#1f3c64" />
      <circle
        cx="140"
        cy="70"
        r="20"
        fill="none"
        stroke="#a8c9f6"
        strokeWidth="8"
      />
      <rect x="62" y="48" width="50" height="7" rx="3" fill="#fff" />
      <rect x="62" y="60" width="38" height="7" rx="3" fill="#a8c9f6" />
      <rect x="54" y="122" width="110" height="9" rx="3" fill={INK} />
      <rect x="54" y="136" width="84" height="5" rx="2.5" fill="#b9c8dc" />
      <rect
        x="54"
        y="152"
        width="122"
        height="20"
        rx="6"
        fill="#f4f7fc"
        stroke={LINE}
      />
      <rect
        className="ps-type"
        x="62"
        y="160"
        width="60"
        height="4"
        rx="2"
        fill={INK}
      />
      <rect
        x="54"
        y="178"
        width="122"
        height="20"
        rx="6"
        fill="#f4f7fc"
        stroke={LINE}
      />
      <rect
        className="ps-type"
        style={v({ animationDelay: ".6s" })}
        x="62"
        y="186"
        width="74"
        height="4"
        rx="2"
        fill={INK}
      />
      <rect
        className="ps-cta"
        x="54"
        y="206"
        width="122"
        height="26"
        rx="13"
        fill={INK}
      />
      <text
        x="115"
        y="223"
        textAnchor="middle"
        fontSize="10"
        fontWeight="700"
        fill="#fff"
      >
        {t.cta} ↗
      </text>
      <path
        d="M200 40C260 40 250 219 176 219M200 219h0"
        fill="none"
        stroke="#c3d0e2"
        strokeDasharray="3 5"
      />
      {visitors.map(([x, y], i) => (
        <circle
          key={i}
          className="ps-visitor"
          r="6"
          fill={i % 2 ? BLUE : "#9fbbe0"}
          style={v({
            "--sx": `${x}px`,
            "--sy": `${y}px`,
            animationDelay: `${i * 0.55}s`,
          })}
        />
      ))}
      <g className="ps-toast">
        <rect x="214" y="104" width="150" height="32" rx="10" fill={INK} />
        <Check x={232} y={120} r={8} />
        <text x="246" y="124" fontSize="10" fontWeight="600" fill="#fff">
          {t.sent}
        </text>
      </g>
      <g fontFamily={MONO} fontSize="8" fill="#8a97a8">
        <text x="232" y="168">
          → 1 {t.cta.toLowerCase()}
        </text>
      </g>
    </>
  );
}

function Restyle({ t }: { t: (typeof copy)["it"] }) {
  return (
    <>
      <defs>
        <clipPath id="ps-r-clip">
          <rect className="ps-wipe" x="0" y="0" width="400" height="260" />
        </clipPath>
      </defs>
      <rect
        x="40"
        y="18"
        width="320"
        height="214"
        rx="12"
        fill="#eceae4"
        stroke="#c9c4b8"
      />
      <rect x="56" y="36" width="288" height="24" fill="#b9b2a2" />
      <text
        x="64"
        y="53"
        fontFamily="Times New Roman, serif"
        fontSize="13"
        fill="#5b5446"
      >
        {t.old}
      </text>
      <rect x="56" y="72" width="128" height="86" fill="#d3cdc0" />
      {[72, 88, 104, 120].map((y) => (
        <rect
          key={y}
          x="196"
          y={y}
          width={140 - (y % 3) * 10}
          height="8"
          fill="#c9c4b8"
        />
      ))}
      <rect x="56" y="170" width="288" height="46" fill="#ddd8cc" />
      <g clipPath="url(#ps-r-clip)">
        <rect
          x="40"
          y="18"
          width="320"
          height="214"
          rx="12"
          fill="#fff"
          stroke="#c3d0e2"
        />
        <text
          x="58"
          y="46"
          fontSize="13"
          fontWeight="700"
          letterSpacing="-.5"
          fill={INK}
        >
          studio<tspan fill={BLUE}>.</tspan>
        </text>
        <rect x="270" y="34" width="72" height="16" rx="8" fill={INK} />
        <rect x="58" y="70" width="130" height="14" rx="3" fill={INK} />
        <rect x="58" y="90" width="100" height="14" rx="3" fill={BLUE} />
        <rect x="58" y="114" width="118" height="5" rx="2.5" fill={LINE} />
        <rect x="58" y="124" width="92" height="5" rx="2.5" fill={LINE} />
        <rect x="58" y="140" width="70" height="18" rx="9" fill={INK} />
        <rect x="210" y="64" width="132" height="96" rx="9" fill="#1f3c64" />
        <circle
          cx="290"
          cy="112"
          r="26"
          fill="none"
          stroke="#a8c9f6"
          strokeWidth="10"
        />
        {[58, 154, 250].map((x) => (
          <rect
            key={x}
            x={x}
            y="172"
            width="92"
            height="44"
            rx="7"
            fill="#f3f7fc"
            stroke={LINE}
          />
        ))}
      </g>
      <g className="ps-wipe">
        <line x1="0" y1="10" x2="0" y2="240" stroke={INK} strokeWidth="2" />
        <circle cx="0" cy="125" r="13" fill={INK} />
        <path
          d="M-5 121l-4 4 4 4M5 121l4 4-4 4"
          fill="none"
          stroke="#fff"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <g fontSize="9" fontWeight="700">
        <rect x="46" y="238" width="46" height="18" rx="9" fill="#b9b2a2" />
        <text x="69" y="250" textAnchor="middle" fill="#fff">
          {t.before}
        </text>
        <rect x="308" y="238" width="46" height="18" rx="9" fill={INK} />
        <text x="331" y="250" textAnchor="middle" fill="#fff">
          {t.after}
        </text>
      </g>
    </>
  );
}

export function ProjectScene({
  scene,
  locale,
  className = "",
}: {
  scene: SceneKey;
  locale: Locale;
  className?: string;
}) {
  const t = copy[locale];
  return (
    <svg
      className={`ps ps-${scene} ${className}`}
      viewBox="0 0 400 260"
      aria-hidden="true"
      focusable="false"
    >
      {scene === "vetrina" && <Vetrina t={t} />}
      {scene === "shop" && <Shop t={t} />}
      {scene === "dashboard" && <Dashboard />}
      {scene === "webapp" && <WebApp t={t} />}
      {scene === "landing" && <Landing t={t} />}
      {scene === "restyle" && <Restyle t={t} />}
    </svg>
  );
}
