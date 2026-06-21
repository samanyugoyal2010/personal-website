/* ============================================================================
   profile.ts — THE ONLY FILE YOU NEED TO EDIT TO MAKE THIS SITE YOURS.
   Everything below drives the design. Replace the TODO placeholders with your
   real info. The design never needs to change.
   ============================================================================ */

export type Project = {
  /** Short name shown large. */
  name: string;
  /** One line on what it is. */
  blurb: string;
  /** The credibility line — a concrete outcome. e.g. "12k users", "#1 on HN", "Acquired". */
  metric?: string;
  /** Year or range, shown as a mono label. */
  year: string;
  /** What it's built with — shown as mono tags. */
  stack: string[];
  /** Optional links. */
  url?: string;
  github?: string;
  /** Longer description shown when the card is expanded. */
  detail?: string;
  /** Status badge, optional. */
  status?: "live" | "building" | "archived";
};

export type Research = {
  title: string;
  summary: string;
  /** e.g. "in progress", "preprint", "published". */
  status?: string;
  year: string;
  url?: string;
};

export type Experience = {
  org: string;
  role: string;
  period: string; // "2025 — now"
  note?: string;
  /** Optional link — the org name becomes a link when set. */
  url?: string;
};

export type Social = {
  label: string;
  /** Short handle/value shown in mono. */
  value: string;
  href: string;
};

export const profile = {
  /* --- Identity ----------------------------------------------------------- */
  name: "Samanyu", // TODO: your full name, e.g. "Samanyu Sharma"
  role: "Builder", // short identity label, e.g. "Builder & Founder"
  /** The masthead manifesto line. Present tense, specific, in your voice. */
  manifesto: "I build things on the internet — mostly nights and weekends.", // TODO
  /** A 1–2 sentence "currently" line that sits in the status row. */
  currentlyBuilding: "an AI hackathon assistant", // TODO

  /* --- Location (drives the live local-time readout) ---------------------- */
  city: "San Francisco", // TODO
  /** IANA timezone — find yours at en.wikipedia.org/wiki/List_of_tz_database_time_zones */
  timezone: "America/Los_Angeles", // TODO

  /* --- About (tight, confident, human) ------------------------------------ */
  about: [
    // TODO: 2–3 short paragraphs in your voice. Specific > vague.
    "I'm a high-school builder who keeps ending up in rooms meant for people twice my age — startups, research, fellowships. I like shipping real things and figuring out the hard parts as I go.",
    "Right now I'm deep in AI: training small models, building tools I actually want to use, and writing about what I learn. If it's ambitious and slightly out of reach, I'm probably interested.",
  ],

  /* --- Projects (lead with your best 3–5) --------------------------------- */
  projects: [
    {
      name: "Hackathon God",
      blurb: "A post-trained Gemma assistant that helps people win hackathons.",
      metric: "Trained on a DevPost dataset of past wins",
      year: "2026",
      stack: ["Gemma 3", "Supabase", "Python"],
      url: "", // TODO
      github: "", // TODO
      status: "building",
      detail:
        "Built a pipeline that ingests a DevPost dataset into Supabase, then post-trains Gemma 3 4B into a domain assistant that suggests ideas, scopes builds, and drafts submissions. TODO: replace with your real description, numbers, and links.",
    },
    {
      name: "Project Two",
      blurb: "TODO — one line on what this is and why it mattered.",
      metric: "TODO — a real outcome (users, stars, award)",
      year: "2025",
      stack: ["Next.js", "TypeScript"],
      url: "",
      github: "",
      status: "live",
      detail: "TODO: a paragraph of detail shown when the card expands.",
    },
    {
      name: "Project Three",
      blurb: "TODO — the third thing you're proud of.",
      metric: "TODO",
      year: "2025",
      stack: ["React", "Node"],
      url: "",
      github: "",
      status: "live",
      detail: "TODO: detail.",
    },
  ] satisfies Project[],

  /* --- Experience / wins (optional but powerful) -------------------------- */
  experience: [
    {
      org: "CodeWithPurpose",
      role: "Co-Founder",
      period: "Jan 2025 — Present",
      url: "https://codewithpurpose.org",
      note: "Co-founded the largest tech-focused nonprofit in California — teaching 5,000+ students across 130 countries how to build with AI, with leading YC and Fortune 500 companies as partners.",
    },
    {
      org: "HackMind",
      role: "Co-Founder",
      period: "Apr 2026 — Present",
      note: "Co-founding a startup with 100+ users on an invite-only waitlist and 500+ people pitched at hackathons. Building the next generation of web-based product development on top of Garry Tan's GSTACK.",
    },
    {
      org: "YC-Backed Startups",
      role: "Engineering Intern",
      period: "Apr 2026 — Present",
      note: "Two YC companies reached out to bring me on. For one, I built their internal growth engine — a tool that drives growth on X through custom algorithms and outbound, automatically detecting when anyone discusses email-related topics and generating a tailored strategy and action plan in real time. For the other I was the first hire, building custom data pipelines to label and annotate training data at scale.",
    },
    {
      org: "EduFund",
      role: "Lead AI/ML Engineering Intern",
      period: "Jul 2025 — Nov 2025",
      url: "https://edufund.in",
      note: "Helped lead a $6M raise at a $70M valuation while directing a team of 7 on an AI financial tool addressing H-1B visa challenges affecting 2M+ people.",
    },
    {
      org: "Nexuify",
      role: "Founder",
      period: "Oct 2024 — Nov 2025",
      url: "https://beta.nexuify.com",
      note: "Built an AI application layer that let AI agents operate on top of LinkedIn. Acquired (mid four figures).",
    },
  ] satisfies Experience[],

  /* --- Research (ML work) ------------------------------------------------- */
  research: [
    {
      title: "Punishment Loops in LLMs",
      summary:
        "Studying how repeated negative-reward signals during post-training reshape model behavior — mapping the line between corrective alignment and reward-driven collapse.",
      status: "in progress",
      year: "2026",
      url: "", // TODO: link a writeup / paper when ready
    },
    {
      title: "Architectural Interventions for Reasoning",
      summary:
        "Exploring targeted changes to transformer architecture and how they shift reasoning, stability, and sample-efficiency in small language models.",
      status: "in progress",
      year: "2026",
      url: "",
    },
  ] satisfies Research[],

  /* --- Contact + socials -------------------------------------------------- */
  email: "samanyu.goyal2010@gmail.com",
  socials: [
    { label: "GitHub", value: "@yourhandle", href: "https://github.com/yourhandle" }, // TODO
    { label: "X", value: "@yourhandle", href: "https://x.com/yourhandle" }, // TODO
    { label: "LinkedIn", value: "in/you", href: "https://linkedin.com/in/you" }, // TODO
  ] satisfies Social[],

  /* --- SEO / meta --------------------------------------------------------- */
  siteUrl: "https://samanyu.dev", // TODO: your real domain (used for OG/canonical)
  metaDescription:
    "Samanyu — a high-school builder shipping real things in AI and on the web.", // TODO
  keywords: ["Samanyu", "builder", "AI", "developer", "portfolio"], // TODO
  twitterHandle: "@yourhandle", // TODO

  /* --- Integrations (optional; see README for setup) ---------------------- */
  /** Your GitHub username — powers the live contribution graph. */
  githubUsername: "", // TODO e.g. "samanyu"
} as const;

export type Profile = typeof profile;
