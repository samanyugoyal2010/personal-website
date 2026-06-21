/* Spotify "now playing" — server-only helpers.
   Uses the refresh-token grant so secrets never touch the client.
   Returns { isPlaying: false } whenever creds are missing or nothing is on,
   so the UI degrades gracefully (never shows a fake/empty live element). */

const TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token";
const NOW_PLAYING_ENDPOINT =
  "https://api.spotify.com/v1/me/player/currently-playing";
const RECENTLY_PLAYED_ENDPOINT =
  "https://api.spotify.com/v1/me/player/recently-played?limit=1";

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

async function getAccessToken(): Promise<string | null> {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;
  if (!clientId || !clientSecret || !refreshToken) return null;

  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const res = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
    cache: "no-store",
  });
  if (!res.ok) return null;
  const data = (await res.json()) as { access_token?: string };
  return data.access_token ?? null;
}

type SpotifyTrack = {
  name: string;
  artists: { name: string }[];
  album: { name: string; images: { url: string }[] };
  external_urls: { spotify: string };
};

function shape(item: SpotifyTrack, isPlaying: boolean, isRecent = false): NowPlaying {
  return {
    isPlaying,
    isRecent,
    title: item.name,
    artist: item.artists.map((a) => a.name).join(", "),
    album: item.album.name,
    albumImage: item.album.images?.[0]?.url,
    songUrl: item.external_urls?.spotify,
  };
}

export async function getNowPlaying(): Promise<NowPlaying> {
  const token = await getAccessToken();
  if (!token) return { isPlaying: false };

  const headers = { Authorization: `Bearer ${token}` };

  // 1) What's playing right now.
  const res = await fetch(NOW_PLAYING_ENDPOINT, { headers, cache: "no-store" });
  if (res.status === 200) {
    const song = (await res.json()) as { is_playing: boolean; item: SpotifyTrack | null };
    if (song?.item) return shape(song.item, song.is_playing);
  }

  // 2) Nothing live → fall back to the most recent track.
  const recent = await fetch(RECENTLY_PLAYED_ENDPOINT, { headers, cache: "no-store" });
  if (recent.status === 200) {
    const data = (await recent.json()) as { items: { track: SpotifyTrack }[] };
    const track = data.items?.[0]?.track;
    if (track) return shape(track, false, true);
  }

  return { isPlaying: false };
}
