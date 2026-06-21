"use client";

import { useCallback, useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";

/* The masthead: the visitor's name set huge in a variable serif whose weight
   bends toward the cursor — each letter thickens as the pointer nears it.
   Cheap, distinctive, high-craft. Fully static under reduced-motion. */

const BASE = 360;
const MAX = 900;
const MIN = 280;
const RADIUS = 240; // px of influence around the cursor
const EASE = 0.16; // lerp factor toward target each frame

function variation(weight: number) {
  return `"opsz" 144, "wght" ${weight.toFixed(0)}, "SOFT" 0, "WONK" 0`;
}

export function Masthead({ name }: { name: string }) {
  const reduce = useReducedMotion();
  const lettersRef = useRef<(HTMLSpanElement | null)[]>([]);
  const centers = useRef<{ x: number; y: number }[]>([]);
  const current = useRef<number[]>([]);
  const pointer = useRef({ x: -9999, y: -9999, active: false });
  const raf = useRef(0);

  const chars = Array.from(name);

  const measure = useCallback(() => {
    centers.current = lettersRef.current.map((el) => {
      if (!el) return { x: -9999, y: -9999 };
      const r = el.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    });
  }, []);

  useEffect(() => {
    if (reduce) return;

    measure();
    const onResize = () => measure();
    const onScroll = () => measure();
    const onMove = (e: PointerEvent) => {
      pointer.current = { x: e.clientX, y: e.clientY, active: true };
    };
    const onLeave = () => {
      pointer.current.active = false;
    };

    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave);

    const tick = () => {
      const els = lettersRef.current;
      for (let i = 0; i < els.length; i++) {
        const el = els[i];
        if (!el) continue;
        const c = centers.current[i];
        let target = BASE;
        if (pointer.current.active && c) {
          const dist = Math.hypot(c.x - pointer.current.x, c.y - pointer.current.y);
          const t = Math.max(0, 1 - dist / RADIUS);
          target = MIN + (MAX - MIN) * (t * t);
        }
        const cur = current.current[i] ?? BASE;
        const next = cur + (target - cur) * EASE;
        current.current[i] = next;
        el.style.fontVariationSettings = variation(next);
      }
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
    };
  }, [reduce, measure]);

  return (
    <h1
      aria-label={name}
      className="select-none font-display leading-[0.82] tracking-[-0.03em] text-ink"
      style={{
        fontSize: "clamp(3.5rem, 16vw, 13rem)",
        fontOpticalSizing: "auto",
      }}
    >
      {chars.map((ch, i) => (
        <span
          key={i}
          ref={(el) => {
            lettersRef.current[i] = el;
          }}
          aria-hidden="true"
          className="inline-block will-change-[font-variation-settings]"
          style={{
            fontVariationSettings: variation(BASE),
            // preserve spaces
            whiteSpace: "pre",
          }}
        >
          {ch}
        </span>
      ))}
    </h1>
  );
}
