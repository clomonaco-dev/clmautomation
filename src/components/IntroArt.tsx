import type { CSSProperties, ReactNode } from "react";
import type { Locale } from "@/lib/routes";

/* Animated SVG illustrations for inner page intros (CSS-driven, no JS). */

export type ArtVariant =
  | "about"
  | "services"
  | "packages"
  | "method"
  | "contact"
  | "projects"
  | "reviews"
  | "restyle"
  | "code"
  | "seo"
  | "globe"
  | "support";

const INK = "#19283f";
const BLUE = "#4574ac";
const LIGHT = "#c9ddfb";
const LINE = "#b3c5de";
const MONO = "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";

const d = (s: number, extra: Record<string, string> = {}) =>
  ({ "--d": `${s}s`, ...extra }) as CSSProperties;
const circle = (cx: number, cy: number, r: number) =>
  `M${cx - r} ${cy}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0`;
const box = (x: number, y: number, w: number, h: number, r = 8) =>
  `M${x + r} ${y}h${w - 2 * r}a${r} ${r} 0 0 1 ${r} ${r}v${h - 2 * r}a${r} ${r} 0 0 1 ${-r} ${r}h${-(w - 2 * r)}a${r} ${r} 0 0 1 ${-r} ${-r}v${-(h - 2 * r)}a${r} ${r} 0 0 1 ${r} ${-r}z`;

function Draw({
  path,
  delay = 0,
  color = BLUE,
  width = 1.5,
  dash,
}: {
  path: string;
  delay?: number;
  color?: string;
  width?: number;
  dash?: boolean;
}) {
  const p = (
    <path
      className="ia-draw"
      pathLength={1}
      d={path}
      fill="none"
      stroke={color}
      strokeWidth={width}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={d(delay)}
    />
  );
  if (!dash) return p;
  // Dashed strokes cannot be drawn with dashoffset: reveal them with a mask.
  return (
    <g>
      <path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth={width}
        strokeDasharray="4 6"
        className="ia-fade"
        style={d(delay)}
      />
    </g>
  );
}

function Pop({
  delay = 0,
  float,
  children,
}: {
  delay?: number;
  float?: number;
  children: ReactNode;
}) {
  const inner = (
    <g className="ia-pop" style={d(delay)}>
      {children}
    </g>
  );
  return float === undefined ? (
    inner
  ) : (
    <g className="ia-float" style={{ "--f": `${float}s` } as CSSProperties}>
      {inner}
    </g>
  );
}

function Chip({
  x,
  y,
  label,
  delay,
  float,
  dot = BLUE,
}: {
  x: number;
  y: number;
  label: string;
  delay: number;
  float?: number;
  dot?: string;
}) {
  const w = label.length * 6.4 + 34;
  return (
    <Pop delay={delay} float={float}>
      <rect
        x={x}
        y={y}
        width={w}
        height="28"
        rx="14"
        fill="#fff"
        stroke={LINE}
      />
      <circle cx={x + 15} cy={y + 14} r="4" fill={dot} />
      <text x={x + 26} y={y + 18} fontSize="11" fontWeight="600" fill={INK}>
        {label}
      </text>
    </Pop>
  );
}

function MiniSite({
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
  const s = w / 230;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect width="230" height={h / s} rx="10" fill="#fff" stroke={LINE} />
      <rect width="230" height="20" rx="10" fill="#edf2f9" />
      <rect y="12" width="230" height="8" fill="#edf2f9" />
      {[10, 19, 28].map((cx) => (
        <circle key={cx} cx={cx} cy="10" r="2.5" fill={LINE} />
      ))}
      <rect x="14" y="34" width="34" height="7" rx="3" fill={INK} />
      <rect x="150" y="33" width="66" height="10" rx="5" fill={INK} />
      <rect x="14" y="58" width="96" height="11" rx="3" fill={INK} />
      <rect x="14" y="74" width="76" height="11" rx="3" fill={BLUE} />
      <rect x="14" y="94" width="88" height="4" rx="2" fill={LINE} />
      <rect x="14" y="102" width="70" height="4" rx="2" fill={LINE} />
      <rect x="120" y="54" width="96" height="62" rx="6" fill="#1f3c64" />
      <path
        d={circle(186, 85, 17)}
        fill="none"
        stroke="#a8c9f6"
        strokeWidth="7"
      />
      {[14, 88, 162].map((cx) => (
        <rect
          key={cx}
          x={cx}
          y="126"
          width="54"
          height="22"
          rx="4"
          fill="#f2f6fc"
          stroke="#dce3ed"
        />
      ))}
    </g>
  );
}

function Star({
  x,
  y,
  r = 9,
  fill = "#e2a93b",
}: {
  x: number;
  y: number;
  r?: number;
  fill?: string;
}) {
  const pts = Array.from({ length: 10 }, (_, i) => {
    const a = (Math.PI / 5) * i - Math.PI / 2;
    const rad = i % 2 ? r * 0.45 : r;
    return `${(x + rad * Math.cos(a)).toFixed(1)},${(y + rad * Math.sin(a)).toFixed(1)}`;
  }).join(" ");
  return <polygon points={pts} fill={fill} />;
}

const labels = {
  it: {
    about: ["Ingegneria", "Design", "Codice"],
    packages: ["Base", "Standard", "Premium"],
    restyle: ["Prima", "Dopo"],
    old: "Benvenuti nel sito",
    support: ["Aggiornamenti", "Nuove sezioni", "Supporto"],
    contact: "Ciao! Vorrei un nuovo sito…",
    build: "✓ build completata",
  },
  en: {
    about: ["Engineering", "Design", "Code"],
    packages: ["Base", "Standard", "Premium"],
    restyle: ["Before", "After"],
    old: "Welcome to our site",
    support: ["Updates", "New sections", "Support"],
    contact: "Hi! I’d like a new website…",
    build: "✓ build complete",
  },
};

function Scene({ variant, locale }: { variant: ArtVariant; locale: Locale }) {
  const t = labels[locale];
  switch (variant) {
    case "about":
      return (
        <>
          <g className="ia-spin" style={{ transformOrigin: "210px 170px" }}>
            {Array.from({ length: 72 }, (_, i) => {
              const a = (i * 5 * Math.PI) / 180;
              const r1 = 132;
              const r2 = i % 6 === 0 ? 120 : 126;
              return (
                <line
                  key={i}
                  x1={210 + r1 * Math.cos(a)}
                  y1={170 + r1 * Math.sin(a)}
                  x2={210 + r2 * Math.cos(a)}
                  y2={170 + r2 * Math.sin(a)}
                  stroke={LINE}
                  strokeWidth={i % 6 === 0 ? 1.4 : 1}
                  className="ia-fade"
                  style={d(0.6)}
                />
              );
            })}
          </g>
          <Draw path={circle(210, 170, 112)} delay={0.1} width={1.6} />
          <g
            className="ia-spin ia-reverse"
            style={{ transformOrigin: "210px 170px" }}
          >
            <Draw path={circle(210, 170, 76)} delay={0.4} color={LINE} dash />
          </g>
          <Draw path="M60 170H360" delay={0.5} color={LINE} width={1} />
          <Draw path="M210 20V320" delay={0.6} color={LINE} width={1} />
          <Draw
            path="M322 170A112 112 0 0 0 289.2 90.8"
            delay={1}
            width={3}
            color={INK}
          />
          <Pop delay={1.3}>
            <text x="304" y="118" fontFamily={MONO} fontSize="11" fill={BLUE}>
              45°
            </text>
          </Pop>
          <Pop delay={0.9}>
            <circle cx="210" cy="170" r="40" fill={INK} />
            <text
              x="210"
              y="178"
              textAnchor="middle"
              fontSize="23"
              fontWeight="700"
              letterSpacing="-1.5"
              fill="#fff"
            >
              clm<tspan fill="#8fb6f0">.</tspan>
            </text>
          </Pop>
          <Pop delay={1.1}>
            <text x="98" y="300" fontFamily={MONO} fontSize="10" fill={BLUE}>
              Ø 224 · 45°44′N
            </text>
          </Pop>
          <Chip x={18} y={58} label={t.about[0]} delay={1.2} float={0} />
          <Chip x={300} y={196} label={t.about[1]} delay={1.4} float={1.5} />
          <Chip
            x={46}
            y={226}
            label={t.about[2]}
            delay={1.6}
            float={3}
            dot="#5fbf91"
          />
        </>
      );
    case "services": {
      const icons = ["⌘", "◈", "↗", "◎", "文", "↻"];
      const pos = icons.map((_, i) => [
        66 + (i % 3) * 102,
        72 + Math.floor(i / 3) * 102,
      ]);
      return (
        <>
          <Draw path={circle(210, 174, 150)} delay={0} color={LINE} dash />
          <Draw
            path={`M${pos[0][0] + 42} ${pos[0][1] + 42}H${pos[2][0] + 42}V${pos[5][1] + 42}H${pos[3][0] + 42}`}
            delay={0.9}
            color={BLUE}
            dash
          />
          {pos.map(([x, y], i) => (
            <Pop key={i} delay={0.2 + i * 0.12} float={i * 0.7}>
              <rect
                x={x}
                y={y}
                width="84"
                height="84"
                rx="16"
                fill={i === 1 ? INK : "#fff"}
                stroke={i === 1 ? INK : LINE}
              />
              <text
                x={x + 42}
                y={y + 52}
                textAnchor="middle"
                fontSize="27"
                fill={i === 1 ? "#a8c9f6" : BLUE}
              >
                {icons[i]}
              </text>
              <text
                x={x + 72}
                y={y + 18}
                textAnchor="end"
                fontFamily={MONO}
                fontSize="8"
                fill={i === 1 ? "#8fb6f0" : "#8a97a8"}
              >
                0{i + 1}
              </text>
            </Pop>
          ))}
        </>
      );
    }
    case "packages":
      return (
        <>
          <Draw path="M40 290H380" delay={0} color={LINE} />
          {[
            [70, 100, "#fff"],
            [170, 160, INK],
            [270, 220, LIGHT],
          ].map(([x, h, fill], i) => (
            <g key={i}>
              <rect
                className="ia-grow"
                style={d(0.2 + i * 0.18)}
                x={x as number}
                y={290 - (h as number)}
                width="80"
                height={h as number}
                rx="10"
                fill={fill as string}
                stroke={i === 1 ? INK : LINE}
              />
              <Pop delay={0.6 + i * 0.18}>
                <text
                  x={(x as number) + 40}
                  y="314"
                  textAnchor="middle"
                  fontSize="12"
                  fontWeight="600"
                  fill={INK}
                >
                  {t.packages[i]}
                </text>
              </Pop>
            </g>
          ))}
          <Draw
            path="M110 176C150 150 180 132 210 116S280 80 310 56"
            delay={1}
            color={BLUE}
            dash
          />
          {[
            [110, 176],
            [210, 116],
            [310, 56],
          ].map(([x, y], i) => (
            <Pop key={i} delay={1.2 + i * 0.15}>
              <circle
                cx={x}
                cy={y}
                r="6"
                fill="#fff"
                stroke={BLUE}
                strokeWidth="2"
              />
            </Pop>
          ))}
          <Pop delay={1.6} float={0}>
            <circle cx="250" cy="148" r="17" fill="#5fbf91" />
            <path
              d="M242 148l6 6 10-11"
              fill="none"
              stroke="#fff"
              strokeWidth="2.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Pop>
        </>
      );
    case "method": {
      const pts = [
        [60, 270],
        [160, 210],
        [260, 150],
        [360, 90],
      ];
      return (
        <>
          {[110, 170, 230].map((y) => (
            <line
              key={y}
              x1="40"
              x2="380"
              y1={y}
              y2={y}
              stroke={LINE}
              strokeDasharray="2 6"
              className="ia-fade"
              style={d(0)}
            />
          ))}
          <Draw
            path="M60 270C110 270 110 210 160 210S210 150 260 150 310 90 360 90"
            delay={0.2}
            width={3}
            color={INK}
          />
          {pts.map(([x, y], i) => (
            <Pop key={i} delay={0.5 + i * 0.3}>
              <circle
                cx={x}
                cy={y}
                r="19"
                fill={i === 3 ? INK : "#fff"}
                stroke={i === 3 ? INK : BLUE}
                strokeWidth="2"
              />
              <text
                x={x}
                y={y + 4}
                textAnchor="middle"
                fontFamily={MONO}
                fontSize="11"
                fontWeight="700"
                fill={i === 3 ? "#fff" : BLUE}
              >
                0{i + 1}
              </text>
            </Pop>
          ))}
          <Pop delay={1.8} float={0}>
            <path d="M360 66V22" stroke={INK} strokeWidth="2" />
            <path d="M360 22h34l-8 9 8 9h-34z" fill={BLUE} />
          </Pop>
          <Pop delay={1.7}>
            <circle
              className="ia-ping"
              cx="360"
              cy="90"
              r="19"
              fill="none"
              stroke={BLUE}
            />
          </Pop>
        </>
      );
    }
    case "contact": {
      const route = "M70 250C120 150 220 290 280 170S330 110 336 102";
      return (
        <>
          <Draw path={route} delay={0.4} color={BLUE} dash />
          <Pop delay={0.1} float={0}>
            <path d={box(26, 46, 196, 74, 14)} fill="#fff" stroke={LINE} />
            <path d="M52 120l-6 18 22-18z" fill="#fff" stroke={LINE} />
            <path d="M48 119h22" stroke="#fff" strokeWidth="3" />
            <circle cx="52" cy="72" r="11" fill={LIGHT} />
            <text x="46" y="76" fontSize="10" fontWeight="700" fill={INK}>
              ✉
            </text>
            <text x="72" y="76" fontSize="11" fontWeight="600" fill={INK}>
              {t.contact}
            </text>
            <rect
              x="72"
              y="88"
              width="120"
              height="5"
              rx="2.5"
              fill="#dce3ed"
            />
            <rect x="72" y="99" width="84" height="5" rx="2.5" fill="#dce3ed" />
          </Pop>
          <g className="ia-fly">
            <path d="M-10 -8L12 0-10 8-5 0z" fill={INK}>
              <animateMotion
                dur="3.4s"
                begin="0.6s"
                repeatCount="indefinite"
                rotate="auto"
                path={route}
              />
            </path>
          </g>
          <Pop delay={1.6}>
            <circle
              className="ia-ping"
              cx="340"
              cy="100"
              r="14"
              fill="none"
              stroke={BLUE}
            />
            <circle
              className="ia-ping"
              style={{ animationDelay: "1.1s" }}
              cx="340"
              cy="100"
              r="14"
              fill="none"
              stroke={BLUE}
            />
            <path
              d="M340 104c-14-16-20-24-20-34a20 20 0 0 1 40 0c0 10-6 18-20 34z"
              fill={INK}
            />
            <circle cx="340" cy="70" r="7" fill="#a8c9f6" />
          </Pop>
          <Pop delay={1.9}>
            <text x="296" y="148" fontFamily={MONO} fontSize="10" fill={BLUE}>
              45°44′N 8°26′E
            </text>
          </Pop>
        </>
      );
    }
    case "projects":
      return (
        <>
          <Pop delay={0.1} float={1}>
            <g transform="rotate(-9 140 150)">
              <rect
                x="30"
                y="80"
                width="210"
                height="146"
                rx="10"
                fill={LIGHT}
                stroke={LINE}
              />
              <rect
                x="44"
                y="104"
                width="90"
                height="10"
                rx="3"
                fill="#8fb0db"
              />
              <rect
                x="44"
                y="122"
                width="70"
                height="10"
                rx="3"
                fill="#8fb0db"
              />
            </g>
          </Pop>
          <Pop delay={0.25} float={2}>
            <g transform="rotate(8 300 150)">
              <rect
                x="190"
                y="70"
                width="210"
                height="146"
                rx="10"
                fill="#1f3c64"
              />
              <rect
                x="206"
                y="94"
                width="80"
                height="10"
                rx="3"
                fill="#a8c9f6"
              />
              <path
                d={circle(360, 150, 22)}
                fill="none"
                stroke="#a8c9f6"
                strokeWidth="8"
              />
            </g>
          </Pop>
          <Pop delay={0.45} float={0}>
            <g filter="url(#ia-shadow)">
              <MiniSite x={85} y={120} w={250} h={172} />
            </g>
          </Pop>
          <Pop delay={1}>
            <rect x="290" y="270" width="96" height="26" rx="13" fill={INK} />
            <text
              x="338"
              y="287"
              textAnchor="middle"
              fontSize="10"
              fontWeight="600"
              fill="#fff"
            >
              studio.it ↗
            </text>
          </Pop>
        </>
      );
    case "reviews":
      return (
        <>
          <Pop delay={0} float={2}>
            <text
              x="22"
              y="150"
              fontSize="190"
              fontFamily="Georgia, serif"
              fill={LIGHT}
            >
              “
            </text>
          </Pop>
          <Pop delay={0.2} float={1}>
            <path d={box(170, 46, 220, 120, 14)} fill={LIGHT} opacity=".6" />
          </Pop>
          <Pop delay={0.35} float={0}>
            <g filter="url(#ia-shadow)">
              <path d={box(70, 110, 260, 150, 16)} fill="#fff" stroke={LINE} />
            </g>
            <rect x="94" y="170" width="200" height="6" rx="3" fill="#dce3ed" />
            <rect x="94" y="184" width="180" height="6" rx="3" fill="#dce3ed" />
            <rect x="94" y="198" width="130" height="6" rx="3" fill="#dce3ed" />
            <circle cx="106" cy="232" r="12" fill={INK} />
            <rect x="126" y="226" width="70" height="6" rx="3" fill={INK} />
            <rect x="126" y="236" width="44" height="5" rx="2.5" fill={LINE} />
          </Pop>
          {[0, 1, 2, 3, 4].map((i) => (
            <Pop key={i} delay={0.8 + i * 0.12}>
              <Star x={104 + i * 24} y={142} />
            </Pop>
          ))}
          <Pop delay={1.5}>
            <circle cx="324" cy="112" r="17" fill="#5fbf91" />
            <path
              d="M316 112l6 6 10-11"
              fill="none"
              stroke="#fff"
              strokeWidth="2.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Pop>
        </>
      );
    case "restyle":
      return (
        <>
          <defs>
            <clipPath id="ia-wipe">
              <rect className="ia-wipe" x="0" y="50" width="300" height="230" />
            </clipPath>
          </defs>
          <Pop delay={0.1}>
            <g filter="url(#ia-shadow)">
              <rect
                x="60"
                y="60"
                width="300"
                height="210"
                rx="12"
                fill="#eceae4"
                stroke="#c9c4b8"
              />
            </g>
            <rect x="76" y="80" width="268" height="22" fill="#b9b2a2" />
            <text
              x="84"
              y="96"
              fontFamily="Times New Roman, serif"
              fontSize="13"
              fill="#5b5446"
            >
              {t.old}
            </text>
            <rect x="76" y="114" width="120" height="80" fill="#d3cdc0" />
            <rect x="206" y="114" width="138" height="8" fill="#c9c4b8" />
            <rect x="206" y="130" width="120" height="8" fill="#c9c4b8" />
            <rect x="206" y="146" width="128" height="8" fill="#c9c4b8" />
            <rect x="76" y="206" width="268" height="48" fill="#ddd8cc" />
          </Pop>
          <g clipPath="url(#ia-wipe)">
            <rect
              x="60"
              y="60"
              width="300"
              height="210"
              rx="12"
              fill="#fff"
              stroke={LINE}
            />
            <MiniSite x={60} y={60} w={300} h={210} />
          </g>
          <g className="ia-wipe">
            <line x1="0" y1="44" x2="0" y2="286" stroke={INK} strokeWidth="2" />
            <circle cx="0" cy="165" r="15" fill={INK} />
            <text x="0" y="170" textAnchor="middle" fontSize="12" fill="#fff">
              ⇆
            </text>
          </g>
          <Chip x={60} y={292} label={t.restyle[0]} delay={0.6} dot="#b9b2a2" />
          <Chip x={290} y={292} label={t.restyle[1]} delay={0.8} />
        </>
      );
    case "code": {
      const rows: [number, number, string][] = [
        [0, 120, "#8fb6f0"],
        [16, 150, "#7fd0ff"],
        [32, 96, "#f0c27b"],
        [32, 140, "#b6e3a8"],
        [16, 84, "#7fd0ff"],
        [0, 40, "#8fb6f0"],
      ];
      return (
        <>
          <Pop delay={0} float={0}>
            <g filter="url(#ia-shadow)">
              <rect
                x="50"
                y="56"
                width="300"
                height="220"
                rx="14"
                fill="#0e1c31"
              />
            </g>
            {[70, 84, 98].map((cx) => (
              <circle key={cx} cx={cx} cy="76" r="4" fill="#ffffff33" />
            ))}
            <rect
              x="118"
              y="66"
              width="70"
              height="20"
              rx="5"
              fill="#ffffff14"
            />
            <text x="128" y="80" fontFamily={MONO} fontSize="9" fill="#cfe0f7">
              App.tsx
            </text>
            {rows.map(([indent, w, c], i) => (
              <g key={i}>
                <text
                  x="66"
                  y={118 + i * 22}
                  fontFamily={MONO}
                  fontSize="9"
                  fill="#ffffff40"
                >
                  {i + 1}
                </text>
                <rect
                  className="ia-growx"
                  style={d(0.4 + i * 0.18)}
                  x={86 + indent}
                  y={110 + i * 22}
                  width={w}
                  height="9"
                  rx="4.5"
                  fill={c}
                  opacity=".85"
                />
              </g>
            ))}
            <rect
              className="ia-caret"
              x="230"
              y="220"
              width="7"
              height="12"
              fill="#a8c9f6"
            />
            <text
              x="66"
              y="262"
              fontFamily={MONO}
              fontSize="10"
              fill="#5fd4a0"
              className="ia-fade"
              style={d(1.7)}
            >
              {t.build}
            </text>
          </Pop>
          <Pop delay={1.2} float={1.5}>
            <circle cx="350" cy="74" r="36" fill={BLUE} />
            <text
              x="350"
              y="81"
              textAnchor="middle"
              fontFamily={MONO}
              fontSize="19"
              fontWeight="700"
              fill="#fff"
            >
              &lt;/&gt;
            </text>
          </Pop>
        </>
      );
    }
    case "seo":
      return (
        <>
          <Pop delay={0} float={0}>
            <g filter="url(#ia-shadow)">
              <path d={box(40, 150, 220, 150, 14)} fill="#fff" stroke={LINE} />
            </g>
            {[190, 220, 250].map((y) => (
              <line key={y} x1="60" x2="240" y1={y} y2={y} stroke="#e4ebf5" />
            ))}
          </Pop>
          <Draw
            path="M60 276L100 262 130 268 165 230 200 214 240 176"
            delay={0.5}
            width={3}
            color={BLUE}
          />
          <Pop delay={1.5}>
            <circle cx="240" cy="176" r="6" fill={BLUE} />
            <circle
              className="ia-ping"
              cx="240"
              cy="176"
              r="6"
              fill="none"
              stroke={BLUE}
            />
          </Pop>
          <Pop delay={0.2} float={1.2}>
            <path d={box(250, 40, 150, 120, 14)} fill={INK} />
            <path
              d="M285 130A40 40 0 0 1 365 130"
              fill="none"
              stroke="#ffffff22"
              strokeWidth="9"
              strokeLinecap="round"
            />
          </Pop>
          <g className="ia-float" style={{ "--f": "1.2s" } as CSSProperties}>
            <Draw
              path="M285 130A40 40 0 0 1 359 108"
              delay={0.8}
              width={9}
              color="#5fd4a0"
            />
          </g>
          <Pop delay={1.3} float={2.4}>
            <path
              d={circle(120, 92, 38)}
              fill="#ffffffcc"
              stroke={INK}
              strokeWidth="6"
            />
            <path
              d="M147 119l30 30"
              stroke={INK}
              strokeWidth="9"
              strokeLinecap="round"
            />
            <path
              d="M104 92l11 11 20-22"
              fill="none"
              stroke={BLUE}
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Pop>
        </>
      );
    case "globe": {
      const langs = ["IT", "EN", "DE", "FR", "ES"];
      const spots = [
        [56, 70],
        [330, 60],
        [358, 200],
        [40, 230],
        [190, 300],
      ];
      return (
        <>
          <Draw path={circle(210, 170, 100)} delay={0} width={2} color={INK} />
          {[-60, -30, 0, 30, 60].map((dy) => {
            const w = Math.sqrt(100 * 100 - dy * dy);
            return (
              <Draw
                key={dy}
                path={`M${210 - w} ${170 + dy}H${210 + w}`}
                delay={0.4}
                color={LINE}
                width={1}
              />
            );
          })}
          {[0, 1, 2, 3].map((i) => (
            <ellipse
              key={i}
              className="ia-meridian"
              style={{ animationDelay: `${-i * 1.5}s` }}
              cx="210"
              cy="170"
              rx="100"
              ry="100"
              fill="none"
              stroke={BLUE}
              strokeWidth="1.2"
            />
          ))}
          {spots.map(([x, y], i) => (
            <g key={i}>
              <Draw
                path={`M210 170L${x + 18} ${y + 14}`}
                delay={0.9 + i * 0.1}
                color={LINE}
                dash
              />
              <Pop delay={1 + i * 0.12} float={i * 0.8}>
                <rect
                  x={x}
                  y={y}
                  width="36"
                  height="28"
                  rx="14"
                  fill={i === 0 ? INK : "#fff"}
                  stroke={i === 0 ? INK : LINE}
                />
                <text
                  x={x + 18}
                  y={y + 18}
                  textAnchor="middle"
                  fontFamily={MONO}
                  fontSize="11"
                  fontWeight="700"
                  fill={i === 0 ? "#fff" : BLUE}
                >
                  {langs[i]}
                </text>
              </Pop>
            </g>
          ))}
        </>
      );
    }
    case "support":
      return (
        <>
          <g
            className="ia-spin"
            style={
              {
                transformOrigin: "210px 170px",
                animationDuration: "18s",
              } as CSSProperties
            }
          >
            <Draw
              path="M210 60A110 110 0 0 1 320 170"
              delay={0.2}
              width={3}
              color={BLUE}
            />
            <path
              d="M320 170l-9-12h18z"
              fill={BLUE}
              className="ia-fade"
              style={d(1)}
            />
            <Draw
              path="M210 280A110 110 0 0 1 100 170"
              delay={0.4}
              width={3}
              color={BLUE}
            />
            <path
              d="M100 170l-9 12h18z"
              fill={BLUE}
              className="ia-fade"
              style={d(1)}
            />
          </g>
          <Draw path={circle(210, 170, 132)} delay={0} color={LINE} dash />
          <Pop delay={0.6}>
            <path
              d="M210 112l50 18v38c0 32-22 52-50 62-28-10-50-30-50-62v-38z"
              fill={INK}
            />
            <path
              d="M190 170l14 14 26-28"
              fill="none"
              stroke="#5fd4a0"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Pop>
          <Chip x={4} y={74} label={t.support[0]} delay={1} float={0} />
          <Chip x={290} y={112} label={t.support[1]} delay={1.2} float={1.4} />
          <Chip
            x={40}
            y={262}
            label={t.support[2]}
            delay={1.4}
            float={2.6}
            dot="#5fbf91"
          />
        </>
      );
  }
}

export function IntroArt({
  variant,
  locale,
}: {
  variant: ArtVariant;
  locale: Locale;
}) {
  return (
    <div className="intro-art" aria-hidden="true">
      <svg viewBox="0 0 420 340">
        <defs>
          <pattern
            id="ia-dots"
            width="18"
            height="18"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="1" cy="1" r="1" fill="#748bad" fillOpacity=".3" />
          </pattern>
          <radialGradient id="ia-fade-grad" cx="50%" cy="50%" r="50%">
            <stop offset=".35" stopColor="#fff" />
            <stop offset="1" stopColor="#000" />
          </radialGradient>
          <mask id="ia-dots-mask">
            <rect width="420" height="340" fill="url(#ia-fade-grad)" />
          </mask>
          <radialGradient id="ia-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0" stopColor="#c9ddfb" stopOpacity=".75" />
            <stop offset="1" stopColor="#c9ddfb" stopOpacity="0" />
          </radialGradient>
          <filter id="ia-shadow" x="-20%" y="-20%" width="140%" height="160%">
            <feDropShadow
              dx="0"
              dy="14"
              stdDeviation="14"
              floodColor="#203e6c"
              floodOpacity=".16"
            />
          </filter>
        </defs>
        <rect
          width="420"
          height="340"
          fill="url(#ia-dots)"
          mask="url(#ia-dots-mask)"
        />
        <circle cx="210" cy="170" r="170" fill="url(#ia-glow)" />
        <Scene variant={variant} locale={locale} />
      </svg>
    </div>
  );
}
