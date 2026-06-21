"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { profile } from "@/content/profile";
import { Section } from "@/components/Section";
import { Reveal } from "@/components/Reveal";

function CopyEmail() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      className="group inline-flex items-center gap-3 font-display text-3xl text-ink transition-colors hover:text-accent sm:text-5xl"
    >
      <span className="link-underline">{profile.email}</span>
      <span className="relative inline-block w-20 text-left font-mono text-xs">
        <AnimatePresence mode="wait" initial={false}>
          {copied ? (
            <motion.span
              key="copied"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="absolute left-0 top-1/2 -translate-y-1/2 text-accent"
            >
              copied ✓
            </motion.span>
          ) : (
            <motion.span
              key="copy"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute left-0 top-1/2 -translate-y-1/2 text-faint opacity-0 transition-opacity group-hover:opacity-100"
            >
              click to copy
            </motion.span>
          )}
        </AnimatePresence>
      </span>
    </button>
  );
}

export function Contact() {
  return (
    <Section id="contact" index="04" title="Contact">
      <div className="space-y-8">
        <Reveal>
          <p className="mb-5 max-w-xl text-lg text-muted">
            Building something interesting, hiring, or just want to talk? My inbox
            is open.
          </p>
          <CopyEmail />
        </Reveal>

        <Reveal delay={0.1}>
          <ul className="flex flex-wrap gap-x-10 gap-y-3 pt-4">
            {profile.socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex items-baseline gap-2"
                >
                  <span className="label text-faint group-hover:text-accent">
                    {s.label}
                  </span>
                  <span className="font-mono text-sm text-muted link-underline group-hover:text-ink">
                    {s.value}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </Section>
  );
}
