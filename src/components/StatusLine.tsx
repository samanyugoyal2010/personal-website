"use client";

import { AnimatePresence, motion } from "motion/react";
import { useNowPlaying, useLocalTime } from "@/lib/hooks";
import { profile } from "@/content/profile";

/* The live status row under the masthead: a real heartbeat for the site.
   now-playing + local time + what you're currently building. */

function Dot({ live }: { live: boolean }) {
  return (
    <span className="relative inline-flex h-2 w-2 shrink-0">
      {live && (
        <motion.span
          className="absolute inline-flex h-full w-full rounded-full bg-accent"
          animate={{ scale: [1, 2.2, 1], opacity: [0.6, 0, 0.6] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
      <span
        className={`relative inline-flex h-2 w-2 rounded-full ${
          live ? "bg-accent" : "bg-faint"
        }`}
      />
    </span>
  );
}

export function StatusLine() {
  const np = useNowPlaying();
  const time = useLocalTime(profile.timezone);
  const playing = !!np?.isPlaying;

  return (
    <div className="flex flex-col gap-3 font-mono text-[0.8rem] text-muted sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-6 sm:gap-y-2">
      {/* currently building */}
      <span className="inline-flex items-center gap-2">
        <Dot live />
        <span>
          <span className="text-faint">currently building</span>{" "}
          <span className="text-ink">{profile.currentlyBuilding}</span>
        </span>
      </span>

      <span className="hidden text-line-strong sm:inline">/</span>

      {/* location + live time */}
      <span className="inline-flex items-center gap-2">
        <span className="text-faint">{profile.city.toLowerCase()}</span>
        <span className="tabular-nums text-ink">
          {time ?? "—"}
        </span>
      </span>

      <span className="hidden text-line-strong sm:inline">/</span>

      {/* now playing */}
      <span className="inline-flex min-w-0 items-center gap-2">
        <Dot live={playing} />
        <AnimatePresence mode="wait">
          {np?.title ? (
            <motion.a
              key={np.title}
              href={np.songUrl}
              target="_blank"
              rel="noreferrer"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.25 }}
              className="inline-flex min-w-0 items-center gap-2 link-underline"
            >
              <span className="text-faint">
                {playing ? "playing" : "last played"}
              </span>
              <span className="truncate text-ink">
                {np.title}
                <span className="text-faint"> — {np.artist}</span>
              </span>
            </motion.a>
          ) : (
            <span className="text-faint">not playing</span>
          )}
        </AnimatePresence>
      </span>
    </div>
  );
}
