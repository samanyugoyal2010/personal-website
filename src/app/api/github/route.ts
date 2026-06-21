import { NextResponse } from "next/server";
import { getGitHubData } from "@/lib/github";
import { profile } from "@/content/profile";

export const runtime = "nodejs";
export const revalidate = 3600;

export async function GET() {
  try {
    const login = profile.githubUsername;
    if (!login) return NextResponse.json(null);
    const data = await getGitHubData(login);
    return NextResponse.json(data, {
      headers: {
        "Cache-Control":
          "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch {
    return NextResponse.json(null);
  }
}
