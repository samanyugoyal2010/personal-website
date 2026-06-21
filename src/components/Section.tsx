import type { ReactNode } from "react";
import { Reveal } from "@/components/Reveal";

/** Editorial section shell: a mono index/eyebrow + the content. */
export function Section({
  id,
  index,
  title,
  children,
  className = "",
}: {
  id?: string;
  index: string;
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={`scroll-mt-20 border-t border-line py-12 sm:py-16 ${className}`}
    >
      <Reveal>
        <div className="mb-7 flex items-center gap-4 sm:mb-9">
          <span className="label text-accent">{index}</span>
          <span className="h-px flex-1 bg-line" />
          <span className="label">{title}</span>
        </div>
      </Reveal>
      {children}
    </section>
  );
}
