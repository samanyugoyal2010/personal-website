"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

const EASE = 0.28;
const INTERACTIVE =
  'a,button,[role="button"],input,textarea,select,[cmdk-item],[data-cursor="pointer"]';

function isInteractive(el: EventTarget | null) {
  return el instanceof Element && !!el.closest(INTERACTIVE);
}

function shouldDisableCursor() {
  return (
    window.matchMedia("(pointer: coarse)").matches ||
    window.matchMedia("(hover: none)").matches ||
    window.matchMedia("(max-width: 639px)").matches
  );
}

function Pikachu() {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      {/* ears */}
      <path
        d="M8 14L4 2L12 10Z"
        fill="#F4D03F"
        stroke="#1a1a1a"
        strokeWidth="0.8"
        strokeLinejoin="round"
      />
      <path d="M5 4L7 9L9 5Z" fill="#1a1a1a" />
      <path
        d="M24 14L28 2L20 10Z"
        fill="#F4D03F"
        stroke="#1a1a1a"
        strokeWidth="0.8"
        strokeLinejoin="round"
      />
      <path d="M27 4L25 9L23 5Z" fill="#1a1a1a" />
      {/* body */}
      <ellipse cx="16" cy="18" rx="10" ry="9" fill="#F4D03F" stroke="#1a1a1a" strokeWidth="0.8" />
      {/* cheeks */}
      <circle cx="10" cy="19" r="2.2" fill="#E74C3C" opacity="0.9" />
      <circle cx="22" cy="19" r="2.2" fill="#E74C3C" opacity="0.9" />
      {/* eyes */}
      <circle cx="12.5" cy="16" r="1.6" fill="#1a1a1a" />
      <circle cx="19.5" cy="16" r="1.6" fill="#1a1a1a" />
      <circle cx="13" cy="15.5" r="0.45" fill="#fff" />
      <circle cx="20" cy="15.5" r="0.45" fill="#fff" />
      {/* nose + mouth */}
      <path d="M16 17.5L15.2 18.3H16.8L16 17.5Z" fill="#1a1a1a" />
      <path
        d="M16 18.8Q14.5 20 13 19M16 18.8Q17.5 20 19 19"
        stroke="#1a1a1a"
        strokeWidth="0.7"
        strokeLinecap="round"
      />
      {/* tail hint */}
      <path
        d="M24 22Q28 20 27 16"
        stroke="#1a1a1a"
        strokeWidth="0.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function CustomCursor() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);
  const target = useRef({ x: -100, y: -100 });
  const pos = useRef({ x: -100, y: -100 });
  const interactive = useRef(false);
  const visible = useRef(false);
  const raf = useRef(0);

  useEffect(() => {
    if (reduce || shouldDisableCursor()) return;

    setActive(true);
    document.documentElement.classList.add("custom-cursor");

    const onMove = (e: PointerEvent) => {
      target.current = { x: e.clientX, y: e.clientY };
      visible.current = true;
    };
    const onLeave = () => {
      visible.current = false;
    };
    const onOver = (e: MouseEvent) => {
      interactive.current = isInteractive(e.target);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave);
    document.addEventListener("mouseover", onOver);

    const tick = () => {
      const el = cursorRef.current;
      if (el) {
        pos.current.x += (target.current.x - pos.current.x) * EASE;
        pos.current.y += (target.current.y - pos.current.y) * EASE;

        el.style.opacity = visible.current ? "1" : "0";
        el.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0) translate(-50%, -50%) scale(${interactive.current ? 1.18 : 1})`;
      }
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf.current);
      document.documentElement.classList.remove("custom-cursor");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("mouseover", onOver);
    };
  }, [reduce]);

  if (!active) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-50 overflow-hidden"
    >
      <div ref={cursorRef} className="custom-cursor-pikachu">
        <Pikachu />
      </div>
    </div>
  );
}
