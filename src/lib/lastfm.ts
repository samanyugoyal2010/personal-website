/* Last.fm "now playing" — server-only helpers.
   Uses user.getRecentTracks; no OAuth or Premium required.
   Returns { isPlaying: false } when unconfigured or empty. */

import { profile } from "@/content/profile";

const API_BASE = "https://ws.audioscrobbler.com/2.0/";

export type NowPlaying = {
  isPlaying: boolean;
  /** True when we're showing the most recent track rather than a live one. */
  isRecent?: boolean;
  title?: string;
  artist?: string;
  album?: string;
  albumImage?: string;
  songUrl?: string;
};

type LastFmImage = { "#text": string; size: string };
type LastFmTrack = {
  name: string;
  url: string;
  artist: { "#text": string };
  album: { "#text": string };
  image?: LastFmImage[];
  "@attr"?: { nowplaying?: string };
};

type LastFmRecentResponse = {
  recenttracks?: {
    track?: LastFmTrack | LastFmTrack[];
  };
};

function pickImage(images?: LastFmImage[]) {
  if (!images?.length) return undefined;
  const bySize = new Map(images.map((i) => [i.size, i["#text"]]));
  return (
    bySize.get("extralarge") ||
    bySize.get("large") ||
    bySize.get("medium") ||
    bySize.get("small") ||
    images.at(-1)?.["#text"]
  );
}

function normalizeTrack(
  track: LastFmTrack | undefined,
): NowPlaying | null {
  if (!track?.name) return null;
  const isPlaying = track["@attr"]?.nowplaying === "true";
  return {
    isPlaying,
    isRecent: !isPlaying,
    title: track.name,
    artist: track.artist?.["#text"],
    album: track.album?.["#text"],
    albumImage: pickImage(track.image),
    songUrl: track.url,
  };
}

export async function getNowPlaying(): Promise<NowPlaying> {
  const apiKey = process.env.LASTFM_API_KEY;
  const username = profile.lastfmUsername;
  if (!apiKey || !username) return { isPlaying: false };

  const params = new URLSearchParams({
    method: "user.getrecenttracks",
    user: username,
    api_key: apiKey,
    format: "json",
    limit: "1",
  });

  const res = await fetch(`${API_BASE}?${params}`, {
    next: { revalidate: 30 },
  });
  if (!res.ok) return { isPlaying: false };

  const data = (await res.json()) as LastFmRecentResponse;
  const raw = data.recenttracks?.track;
  const track = Array.isArray(raw) ? raw[0] : raw;
  return normalizeTrack(track) ?? { isPlaying: false };
}
