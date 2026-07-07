"use client";

import { Command } from "cmdk";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { profile } from "@/content/profile";

/* ⌘K command surface — two audiences, one feature.
   Recruiters click items; engineers flip to terminal and type. */

type Line = { kind: "in" | "out" | "sys"; text: string };

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

const NAV = [
  { id: "experience", label: "Experience", hint: "where I've worked" },
  { id: "about", label: "About", hint: "who I am" },
  { id: "research", label: "Research", hint: "my ML work" },
  { id: "contact", label: "Learn More", hint: "email & socials" },
];

export function CommandMenu() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"menu" | "terminal">("menu");
  const [lines, setLines] = useState<Line[]>([
    {
      kind: "sys",
      text: `${profile.name.toLowerCase().replace(/\s+/g, "")}@web ~ %  type 'help' to begin.`,
    },
  ]);
  const [input, setInput] = useState("");
  const [histIdx, setHistIdx] = useState(-1);
  const termInputRef = useRef<HTMLInputElement>(null);
  const termBodyRef = useRef<HTMLDivElement>(null);

  const inputHistory = useMemo(
    () => lines.filter((l) => l.kind === "in").map((l) => l.text),
    [lines],
  );

  // Toggle with ⌘K / Ctrl+K; close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // Lock body scroll while open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Focus the prompt on entering terminal mode
  useEffect(() => {
    if (mode === "terminal") {
      requestAnimationFrame(() => termInputRef.current?.focus());
    }
  }, [mode]);

  // Autoscroll terminal
  useEffect(() => {
    termBodyRef.current?.scrollTo({ top: termBodyRef.current.scrollHeight });
  }, [lines]);

  const close = useCallback(() => {
    setOpen(false);
    // reset to menu next open
    setTimeout(() => setMode("menu"), 200);
  }, []);

  const runNav = (id: string) => {
    close();
    setTimeout(() => scrollTo(id), 220);
  };

  const print = (out: Line[]) => setLines((l) => [...l, ...out]);

  const runCommand = (raw: string) => {
    const cmd = raw.trim();
    const lower = cmd.toLowerCase();
    const out: Line[] = [{ kind: "in", text: cmd }];

    const push = (text: string) => out.push({ kind: "out", text });

    if (lower === "clear" || lower === "cls") {
      setLines([]);
      return;
    } else if (lower === "help" || lower === "?") {
      push("available commands —");
      push("  whoami        who I am");
      push("  experience    where I've worked");
      push("  research      my ML research");
      push("  cat about     read my bio");
      push("  socials       where to find me");
      push("  email         copy my email");
      push("  goto <name>   jump to a section (experience/about/research/contact)");
      push("  sudo hire-me  ;)");
      push("  clear         wipe the screen");
    } else if (lower === "whoami") {
      push(`${profile.name} — ${profile.role}.`);
      push(profile.manifesto);
    } else if (lower === "ls") {
      push("  experience/   research/   about/   contact/");
    } else if (
      lower === "experience" ||
      lower === "cv" ||
      lower === "resume" ||
      lower === "ls experience"
    ) {
      profile.experience.forEach((e) =>
        push(`  ${e.org} — ${e.role}  (${e.period})`),
      );
    } else if (lower === "cat about" || lower === "about") {
      profile.about.forEach((p) => push(p));
    } else if (lower === "research" || lower === "ls research") {
      profile.research.forEach((r) =>
        push(`  ${r.title}  —  ${r.status ?? r.year}`),
      );
    } else if (lower === "socials" || lower === "social") {
      profile.socials.forEach((s) => push(`  ${s.label.padEnd(10)} ${s.href}`));
    } else if (lower === "email" || lower === "mail") {
      navigator.clipboard?.writeText(profile.email).catch(() => {});
      push(`copied ${profile.email} to clipboard ✓`);
    } else if (lower.startsWith("goto ")) {
      const target = lower.slice(5).trim();
      if (NAV.some((n) => n.id === target)) {
        push(`→ ${target}`);
        setLines((l) => [...l, ...out]);
        close();
        setTimeout(() => scrollTo(target), 220);
        return;
      }
      push(`no such section: ${target}`);
    } else if (lower === "sudo hire-me" || lower === "hire-me" || lower === "hire me") {
      push("Excellent decision. Opening a draft… ✦");
      setLines((l) => [...l, ...out]);
      setTimeout(() => {
        window.location.href = `mailto:${profile.email}?subject=Let's build something`;
      }, 400);
      return;
    } else if (lower === "sudo") {
      push("nice try.");
    } else if (lower.startsWith("echo ")) {
      push(cmd.slice(5));
    } else if (lower === "theme" || lower === "light") {
      push("there is only darkness here. ▪");
    } else if (lower === "exit" || lower === "q" || lower === ":q") {
      setLines((l) => [...l, ...out]);
      close();
      return;
    } else if (lower === "") {
      // no-op
    } else {
      push(`command not found: ${cmd}. try 'help'.`);
    }

    print(out);
  };

  const onTermKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      runCommand(input);
      setInput("");
      setHistIdx(-1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (inputHistory.length === 0) return;
      const ni = histIdx < 0 ? inputHistory.length - 1 : Math.max(0, histIdx - 1);
      setHistIdx(ni);
      setInput(inputHistory[ni]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (histIdx < 0) return;
      const ni = histIdx + 1;
      if (ni >= inputHistory.length) {
        setHistIdx(-1);
        setInput("");
      } else {
        setHistIdx(ni);
        setInput(inputHistory[ni]);
      }
    }
  };

  const chips = ["whoami", "ls projects", "writing", "sudo hire-me"];

  return (
    <>
      {/* Floating trigger / hint, bottom-right */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open command menu"
        className="fixed bottom-4 right-4 z-40 inline-flex items-center gap-2 rounded-full border border-line-strong bg-surface/80 px-3.5 py-2 font-mono text-xs text-muted backdrop-blur-md transition-colors hover:border-accent/40 hover:text-ink"
      >
        <span className="hidden sm:inline">⌘K</span>
        <span className="sm:hidden">›_</span>
        <span className="hidden sm:inline text-faint">menu</span>
      </button>

      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-[80]">
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              onClick={close}
            />
            <motion.div
              key="panel"
              role="dialog"
              aria-modal="true"
              aria-label="Command menu"
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="fixed left-1/2 top-[12vh] z-10 w-[min(92vw,40rem)] -translate-x-1/2 overflow-hidden rounded-xl border border-line-strong bg-surface shadow-2xl shadow-black/50"
            >
                {/* header / mode switch */}
                <div className="flex items-center justify-between border-b border-line px-3 py-2">
                  <div className="flex gap-1">
                    {(["menu", "terminal"] as const).map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setMode(m)}
                        className={`rounded-md px-2.5 py-1 font-mono text-xs transition-colors ${
                          mode === m
                            ? "bg-accent-soft text-accent"
                            : "text-faint hover:text-muted"
                        }`}
                      >
                        {m === "menu" ? "navigate" : "terminal"}
                      </button>
                    ))}
                  </div>
                  <kbd className="font-mono text-[0.65rem] text-faint">esc to close</kbd>
                </div>

                {mode === "menu" ? (
                  <Command label="Command menu" shouldFilter className="outline-none">
                    <Command.Input
                      autoFocus
                      placeholder="Search or jump to…"
                      className="w-full border-b border-line bg-transparent px-4 py-3.5 font-mono text-sm text-ink outline-none placeholder:text-faint"
                    />
                    <Command.List className="max-h-[min(50vh,22rem)] overflow-y-auto p-2">
                      <Command.Empty className="px-3 py-6 text-center font-mono text-sm text-faint">
                        no matches. try the terminal ›_
                      </Command.Empty>

                      <Command.Group heading="Navigate" className="cmdk-group">
                        {NAV.map((n) => (
                          <Command.Item
                            key={n.id}
                            value={`${n.label} ${n.hint}`}
                            onSelect={() => runNav(n.id)}
                            className="flex cursor-pointer items-center justify-between rounded-md px-3 py-2.5 text-sm text-muted data-[selected=true]:bg-accent-soft data-[selected=true]:text-ink"
                          >
                            <span>{n.label}</span>
                            <span className="label text-faint">{n.hint}</span>
                          </Command.Item>
                        ))}
                      </Command.Group>

                      <Command.Group heading="Actions" className="cmdk-group">
                        <Command.Item
                          value="copy email contact"
                          onSelect={() => {
                            navigator.clipboard?.writeText(profile.email).catch(() => {});
                            close();
                          }}
                          className="flex cursor-pointer items-center justify-between rounded-md px-3 py-2.5 text-sm text-muted data-[selected=true]:bg-accent-soft data-[selected=true]:text-ink"
                        >
                          <span>Copy email</span>
                          <span className="label text-faint">{profile.email}</span>
                        </Command.Item>
                        <Command.Item
                          value="terminal command line"
                          onSelect={() => setMode("terminal")}
                          className="flex cursor-pointer items-center justify-between rounded-md px-3 py-2.5 text-sm text-muted data-[selected=true]:bg-accent-soft data-[selected=true]:text-ink"
                        >
                          <span>Open terminal</span>
                          <span className="label text-faint">›_ type commands</span>
                        </Command.Item>
                      </Command.Group>

                      {profile.socials.length > 0 && (
                        <Command.Group heading="Elsewhere" className="cmdk-group">
                          {profile.socials.map((s) => (
                            <Command.Item
                              key={s.label}
                              value={`${s.label} ${s.value}`}
                              onSelect={() => {
                                window.open(s.href, "_blank", "noreferrer");
                                close();
                              }}
                              className="flex cursor-pointer items-center justify-between rounded-md px-3 py-2.5 text-sm text-muted data-[selected=true]:bg-accent-soft data-[selected=true]:text-ink"
                            >
                              <span>{s.label}</span>
                              <span className="label text-faint">{s.value}</span>
                            </Command.Item>
                          ))}
                        </Command.Group>
                      )}
                    </Command.List>
                  </Command>
                ) : (
                  <div className="flex flex-col">
                    <div
                      ref={termBodyRef}
                      className="max-h-[min(50vh,22rem)] min-h-[12rem] overflow-y-auto px-4 py-3 font-mono text-[0.82rem] leading-relaxed"
                    >
                      {lines.map((l, i) => (
                        <div
                          key={i}
                          className={
                            l.kind === "in"
                              ? "text-ink"
                              : l.kind === "sys"
                                ? "text-faint"
                                : "whitespace-pre-wrap text-muted"
                          }
                        >
                          {l.kind === "in" ? (
                            <span>
                              <span className="text-accent">› </span>
                              {l.text}
                            </span>
                          ) : (
                            l.text
                          )}
                        </div>
                      ))}
                    </div>

                    {/* tappable chips for mobile / discovery */}
                    <div className="flex flex-wrap gap-1.5 border-t border-line px-3 py-2">
                      {chips.map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => {
                            runCommand(c);
                            termInputRef.current?.focus();
                          }}
                          className="rounded-md border border-line px-2 py-1 font-mono text-[0.7rem] text-muted transition-colors hover:border-accent/40 hover:text-ink"
                        >
                          {c}
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 border-t border-line px-4 py-3 font-mono text-sm">
                      <span className="text-accent">›</span>
                      <input
                        ref={termInputRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={onTermKey}
                        spellCheck={false}
                        autoComplete="off"
                        placeholder="type a command…"
                        className="w-full bg-transparent text-ink outline-none placeholder:text-faint"
                      />
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>
    </>
  );
}
