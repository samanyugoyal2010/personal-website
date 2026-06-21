import { profile } from "@/content/profile";
import { Masthead } from "@/components/Masthead";
import { StatusLine } from "@/components/StatusLine";

export function Hero() {
  return (
    <section className="flex min-h-[78vh] flex-col justify-center py-10">
      <p className="label mb-5 text-accent">{profile.role}</p>

      <Masthead name={profile.name} />

      <p className="mt-6 max-w-2xl text-balance font-display text-xl italic leading-snug text-ink/85 sm:text-3xl">
        {profile.manifesto}
      </p>

      <div className="mt-8 border-t border-line pt-5">
        <StatusLine />
      </div>
    </section>
  );
}
