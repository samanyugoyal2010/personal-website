/* GitHub activity — server-only helpers.
   Contribution calendar via GraphQL + latest public push via REST.
   Returns null when unconfigured so the UI can hide gracefully. */

export type ContribDay = {
  date: string;
  count: number;
  /** 0–4 intensity bucket for the heatmap. */
  level: 0 | 1 | 2 | 3 | 4;
};

export type GitHubData = {
  totalContributions: number;
  weeks: ContribDay[][];
  lastPush?: { repo: string; at: string };
};

const GRAPHQL = "https://api.github.com/graphql";

const QUERY = `query ($login: String!) {
  user(login: $login) {
    contributionsCollection {
      contributionCalendar {
        totalContributions
        weeks {
          contributionDays { contributionCount date }
        }
      }
    }
  }
}`;

function bucket(count: number): ContribDay["level"] {
  if (count <= 0) return 0;
  if (count < 3) return 1;
  if (count < 6) return 2;
  if (count < 10) return 3;
  return 4;
}

export async function getGitHubData(login: string): Promise<GitHubData | null> {
  const token = process.env.GITHUB_TOKEN;
  if (!token || !login) return null;

  const res = await fetch(GRAPHQL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: QUERY, variables: { login } }),
    // Cache at the data layer; the route also sets s-maxage.
    next: { revalidate: 3600 },
  });
  if (!res.ok) return null;

  const json = (await res.json()) as {
    data?: {
      user?: {
        contributionsCollection?: {
          contributionCalendar?: {
            totalContributions: number;
            weeks: { contributionDays: { contributionCount: number; date: string }[] }[];
          };
        };
      };
    };
  };

  const cal = json.data?.user?.contributionsCollection?.contributionCalendar;
  if (!cal) return null;

  const weeks: ContribDay[][] = cal.weeks.map((w) =>
    w.contributionDays.map((d) => ({
      date: d.date,
      count: d.contributionCount,
      level: bucket(d.contributionCount),
    })),
  );

  const data: GitHubData = {
    totalContributions: cal.totalContributions,
    weeks,
  };

  // Latest public push (best-effort; failure is non-fatal).
  try {
    const events = await fetch(
      `https://api.github.com/users/${login}/events/public?per_page=20`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github+json",
        },
        next: { revalidate: 1800 },
      },
    );
    if (events.ok) {
      const list = (await events.json()) as {
        type: string;
        repo: { name: string };
        created_at: string;
      }[];
      const push = list.find((e) => e.type === "PushEvent");
      if (push) data.lastPush = { repo: push.repo.name, at: push.created_at };
    }
  } catch {
    // ignore
  }

  return data;
}
