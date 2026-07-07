import { NextResponse } from "next/server";
import { getNowPlaying } from "@/lib/lastfm";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await getNowPlaying();
    return NextResponse.json(data, {
      headers: {
        // Edge-cache briefly; keep it feeling live.
        "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
      },
    });
  } catch {
    return NextResponse.json({ isPlaying: false });
  }
}
