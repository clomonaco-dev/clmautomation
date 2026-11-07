"use client";
import { useEffect, useRef } from "react";

/* Method page: a vertical line that draws itself as you scroll and lights up each step. */

const ICONS = [
  // conversation
  "M10 12h22a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H20l-7 6v-6h-3a4 4 0 0 1-4-4V16a4 4 0 0 1 4-4zM40 22h4a4 4 0 0 1 4 4v8a4 4 0 0 1-4 4h-2v5l-6-5h-8",
  // wireframe
  "M8 10h40v34H8zM8 18h40M14 24h14M14 30h10M32 24h10v14H32zM14 36h12",
  // code
  "M20 16L9 27l11 11M36 16l11 11-11 11M31 12l-6 30",
  // launch
  "M28 8c8 6 11 15 9 26l-9 6-9-6c-2-11 1-20 9-26zM28 20a3.5 3.5 0 1 0 0 .1M19 34l-7 6 1-9M37 34l7 6-1-9M24 44l4 6 4-6",
];

export function Timeline({
  steps,
  deliverables,
}: {
  steps: readonly (readonly [string, string])[];
  deliverables: string[];
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const list = ref.current;
    if (!list) return;
    const fill = list.querySelector<HTMLElement>(".tl-fill");
    const items = [...list.querySelectorAll<HTMLElement>(".tl-step")];
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = list.getBoundingClientRect();
      const line = innerHeight * 0.6;
      const p = Math.min(1, Math.max(0, (line - r.top) / r.height));
      if (fill) fill.style.transform = `scaleY(${p})`;
      for (const item of items) {
        const node = item.querySelector<HTMLElement>(".tl-node")!;
        const nr = node.getBoundingClientRect();
        item.classList.toggle("is-on", nr.top + nr.height / 2 < line);
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div className="timeline" ref={ref}>
      <span className="tl-track" aria-hidden="true">
        <span className="tl-fill" />
      </span>
      <ol>
        {steps.map(([title, text], i) => (
          <li className="tl-step" key={title}>
            <span className="tl-node" aria-hidden="true">
              0{i + 1}
            </span>
            <div className="tl-card">
              <svg className="tl-icon" viewBox="0 0 56 56" aria-hidden="true">
                <path d={ICONS[i]} pathLength={1} />
              </svg>
              <p className="tl-index">
                {String(i + 1).padStart(2, "0")} /{" "}
                {String(steps.length).padStart(2, "0")}
              </p>
              <h3>{title}</h3>
              <p>{text}</p>
              <p className="tl-deliverable">
                <span aria-hidden="true">→</span> {deliverables[i]}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
