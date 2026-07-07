"use client";

import useSWR from "swr";
import { useEffect, useState } from "react";
import type { NowPlaying } from "@/lib/lastfm";
import type { GitHubData } from "@/lib/github";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

/** Live "now playing". Polls every 30s, revalidates on focus. */
export function useNowPlaying() {
  const { data } = useSWR<NowPlaying>("/api/now-playing", fetcher, {
    refreshInterval: 30_000,
    revalidateOnFocus: true,
    shouldRetryOnError: false,
  });
  return data;
}

/** GitHub contribution data. Cached hard on the server; refetched hourly. */
export function useGitHub() {
  const { data } = useSWR<GitHubData | null>("/api/github", fetcher, {
    refreshInterval: 3_600_000,
    revalidateOnFocus: false,
    shouldRetryOnError: false,
  });
  return data;
}

/** Live local time in the given IANA timezone. Null until mounted (no SSR mismatch). */
export function useLocalTime(timezone: string) {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone: timezone,
    });
    const update = () => setTime(fmt.format(new Date()));
    update();
    const id = setInterval(update, 10_000);
    return () => clearInterval(id);
  }, [timezone]);

  return time;
}
