"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useNowPlaying } from "@/lib/hooks";

function Equalizer({ animate }: { animate: boolean }) {
  const reduce = useReducedMotion();
  const bars = [0, 1, 2];
  return (
    <span className="flex h-3 items-end gap-[2px]" aria-hidden>
      {bars.map((i) => (
        <motion.span
          key={i}
          className="w-[2px] rounded-full bg-accent"
          initial={{ height: 4 }}
          animate={
            animate && !reduce
              ? { height: [4, 12, 6, 11, 4] }
              : { height: 4 }
          }
          transition={{
            duration: 0.9,
            repeat: animate && !reduce ? Infinity : 0,
            ease: "easeInOut",
            delay: i * 0.15,
          }}
        />
      ))}
    </span>
  );
}

export function NowPlayingBar() {
  const np = useNowPlaying();
  const show = !!np?.title;

  return (
    <AnimatePresence>
      {show && (
        <motion.a
          href={np!.songUrl}
          target="_blank"
          rel="noreferrer"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="group fixed bottom-4 left-4 z-40 flex max-w-[min(78vw,20rem)] items-center gap-3 rounded-full border border-line-strong bg-surface/80 py-1.5 pl-1.5 pr-4 backdrop-blur-md transition-colors hover:border-accent/40"
        >
          {np!.albumImage ? (
            <Image
              src={np!.albumImage}
              alt={np!.album ?? ""}
              width={36}
              height={36}
              unoptimized
              className="h-9 w-9 rounded-full object-cover"
            />
          ) : (
            <span className="h-9 w-9 rounded-full bg-surface-2" />
          )}

          <span className="flex min-w-0 flex-col leading-tight">
            <span className="flex items-center gap-2">
              <Equalizer animate={!!np!.isPlaying} />
              <span className="label text-faint">
                {np!.isPlaying ? "now playing" : "last played"}
              </span>
            </span>
            <span className="truncate text-sm text-ink">
              {np!.title}
              <span className="text-faint"> — {np!.artist}</span>
            </span>
          </span>
        </motion.a>
      )}
    </AnimatePresence>
  );
}
