"use client";

import { useGitHub } from "@/lib/hooks";
import { profile } from "@/content/profile";
import { Reveal } from "@/components/Reveal";

const levelAlpha = [0.07, 0.28, 0.5, 0.74, 1];

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export function GitHubActivity() {
  const data = useGitHub();

  // Nothing to show (unconfigured or errored) → render nothing. No fake graph.
  if (!profile.githubUsername || !data) return null;

  return (
    <Reveal className="border-t border-line py-8">
      <div className="mb-5 flex flex-wrap items-baseline justify-between gap-3">
        <div className="flex items-baseline gap-3">
          <span className="label text-accent">∗</span>
          <span className="label">Momentum</span>
        </div>
        <div className="font-mono text-xs text-muted">
          <span className="text-ink tabular-nums">
            {data.totalContributions.toLocaleString()}
          </span>{" "}
          contributions this year
          {data.lastPush && (
            <>
              {" · "}
              <span className="text-faint">last push </span>
              <span className="text-ink">{timeAgo(data.lastPush.at)}</span>
              <span className="text-faint"> to {data.lastPush.repo.split("/")[1]}</span>
            </>
          )}
        </div>
      </div>

      <div className="overflow-x-auto pb-1">
        <div className="flex gap-[3px]">
          {data.weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-[3px]">
              {week.map((day) => (
                <span
                  key={day.date}
                  title={`${day.count} on ${day.date}`}
                  className="h-[10px] w-[10px] rounded-[2px]"
                  style={{
                    backgroundColor:
                      day.level === 0
                        ? "rgba(236,233,226,0.07)"
                        : `rgba(255,74,28,${levelAlpha[day.level]})`,
                  }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </Reveal>
  );
}
