"use client";

import { useEffect, useState } from "react";
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "motion/react";
import { profile } from "@/content/profile";

/* A playful "am I online right now?" meter. Estimates the odds Samanyu is
   awake and building from the local hour + weekday — builder hours skew late
   nights and weekends. Updates itself every minute. */

type Odds = { pct: number; caption: string };

function computeOdds(tz: string): Odds {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    hour: "numeric",
    hour12: false,
    weekday: "short",
  }).formatToParts(new Date());

  let hour = 0;
  let weekday = "";
  for (const p of parts) {
    if (p.type === "hour") hour = parseInt(p.value, 10) % 24;
    if (p.type === "weekday") weekday = p.value;
  }
  const weekend = weekday === "Sat" || weekday === "Sun";

  if (hour >= 2 && hour < 7)
    return { pct: 6, caption: "Dead asleep. Probably. The work will be there at sunrise." };
  if (hour >= 7 && hour < 15)
    return weekend
      ? { pct: 74, caption: "Weekend daylight — heads-down on something I shouldn't be." }
      : { pct: 33, caption: "Theoretically in class. Realistically on a second monitor." };
  if (hour >= 15 && hour < 18)
    return weekend
      ? { pct: 82, caption: "Afternoon flow state. Hard to reach, easy to ship." }
      : { pct: 63, caption: "School's out, side projects are in." };
  if (hour >= 18 && hour < 24)
    return { pct: 93, caption: "Prime building hours. Almost certainly shipping." };
  // 0–2
  return { pct: 84, caption: "Night-owl mode engaged. Still going, probably shouldn't be." };
}

export function ActivityOdds() {
  const reduce = useReducedMotion();
  const [odds, setOdds] = useState<Odds | null>(null);

  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v));

  useEffect(() => {
    const update = () => setOdds(computeOdds(profile.timezone));
    update();
    const id = setInterval(update, 60_000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (odds == null) return;
    if (reduce) {
      count.set(odds.pct);
      return;
    }
    const controls = animate(count, odds.pct, { duration: 1.1, ease: [0.16, 1, 0.3, 1] });
    return () => controls.stop();
  }, [odds, reduce, count]);

  const pct = odds?.pct ?? 0;

  return (
    <section
      id="status"
      className="scroll-mt-24 border-t border-line py-12 sm:py-16"
    >
      <div className="mb-7 flex items-center gap-4">
        <span className="label text-accent">∗</span>
        <span className="h-px flex-1 bg-line" />
        <span className="label">Am I online right now?</span>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex items-baseline gap-4">
          <span className="font-display text-7xl leading-none tracking-tight text-ink tabular-nums sm:text-8xl">
            <motion.span>{rounded}</motion.span>
            <span className="text-accent">%</span>
          </span>
          <span className="label max-w-[8rem] text-faint">
            chance I&apos;m awake &amp; building
          </span>
        </div>
        <p className="max-w-md text-pretty text-muted">
          {odds?.caption ?? "Checking the clock…"}
        </p>
      </div>

      <div className="mt-6 h-1.5 w-full overflow-hidden rounded-full bg-line">
        <motion.div
          className="h-full rounded-full bg-accent"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </section>
  );
}
