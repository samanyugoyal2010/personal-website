import { profile } from "@/content/profile";
import { Section } from "@/components/Section";
import { Reveal } from "@/components/Reveal";

export function Experience() {
  if (profile.experience.length === 0) return null;

  return (
    <Section id="experience" index="01" title="Experience">
      <ul className="border-t border-line">
        {profile.experience.map((exp, i) => (
          <Reveal
            as="li"
            key={exp.org + exp.period}
            delay={i * 0.04}
            className="grid gap-x-8 gap-y-2 border-b border-line py-6 sm:grid-cols-[1fr_auto]"
          >
            <div className="min-w-0">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <h3 className="font-display text-2xl leading-none tracking-tight text-ink sm:text-3xl">
                  {exp.url ? (
                    <a
                      href={exp.url}
                      target="_blank"
                      rel="noreferrer"
                      className="group/link inline-flex items-baseline gap-1.5 transition-colors hover:text-accent"
                    >
                      {exp.org}
                      <svg
                        width="11"
                        height="11"
                        viewBox="0 0 11 11"
                        fill="none"
                        aria-hidden
                        className="translate-y-[-0.1em] text-faint transition-colors group-hover/link:text-accent"
                      >
                        <path
                          d="M2 9L9 2M9 2H3.5M9 2V7.5"
                          stroke="currentColor"
                          strokeWidth="1.3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </a>
                  ) : (
                    exp.org
                  )}
                </h3>
                {exp.role && (
                  <span className="label text-accent">{exp.role}</span>
                )}
              </div>
              {exp.note && (
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
                  {exp.note}
                </p>
              )}
            </div>
            <span className="label shrink-0 text-faint tabular-nums sm:pt-1 sm:text-right">
              {exp.period}
            </span>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
