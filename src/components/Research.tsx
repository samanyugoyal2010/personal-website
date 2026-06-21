import { profile } from "@/content/profile";
import { Section } from "@/components/Section";
import { Reveal } from "@/components/Reveal";

export function Research() {
  if (profile.research.length === 0) return null;

  return (
    <Section id="research" index="03" title="Research">
      <ul className="border-t border-line">
        {profile.research.map((r, i) => {
          const inner = (
            <>
              <div className="min-w-0">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <h3 className="font-display text-2xl leading-tight text-ink transition-colors group-hover:text-accent sm:text-3xl">
                    {r.title}
                  </h3>
                  {r.status && (
                    <span className="label rounded-full border border-line px-2 py-0.5 text-faint">
                      {r.status}
                    </span>
                  )}
                </div>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
                  {r.summary}
                </p>
              </div>
              <span className="label shrink-0 text-faint tabular-nums sm:pt-1 sm:text-right">
                {r.year}
              </span>
            </>
          );

          return (
            <Reveal as="li" key={r.title} delay={i * 0.04}>
              {r.url ? (
                <a
                  href={r.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group grid gap-x-8 gap-y-2 border-b border-line py-6 sm:grid-cols-[1fr_auto]"
                >
                  {inner}
                </a>
              ) : (
                <div className="group grid gap-x-8 gap-y-2 border-b border-line py-6 sm:grid-cols-[1fr_auto]">
                  {inner}
                </div>
              )}
            </Reveal>
          );
        })}
      </ul>
    </Section>
  );
}
