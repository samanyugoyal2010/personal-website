import { profile } from "@/content/profile";
import { Section } from "@/components/Section";
import { Reveal } from "@/components/Reveal";

export function About() {
  return (
    <Section id="about" index="02" title="About">
      <Reveal className="max-w-3xl space-y-6">
        {profile.about.map((para, i) => (
          <p
            key={i}
            className="font-display text-2xl leading-relaxed text-ink/90 sm:text-3xl"
          >
            {para}
          </p>
        ))}
      </Reveal>
    </Section>
  );
}
