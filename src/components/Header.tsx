import { profile } from "@/content/profile";

const links = [
  { id: "experience", label: "Experience" },
  { id: "about", label: "About" },
  { id: "research", label: "Research" },
  { id: "contact", label: "Contact" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-30 -mx-5 mb-2 border-b border-line/60 bg-canvas/70 px-5 backdrop-blur-md sm:-mx-8 sm:px-8">
      <div className="flex h-14 items-center justify-between">
        <a
          href="#main"
          className="font-mono text-sm text-ink transition-colors hover:text-accent"
        >
          {profile.name.toLowerCase().replace(/\s+/g, "")}
          <span className="text-accent">.</span>
        </a>
        <nav className="flex items-center gap-6">
          <ul className="hidden gap-6 sm:flex">
            {links.map((l) => (
              <li key={l.id}>
                <a
                  href={`#${l.id}`}
                  className="font-mono text-xs text-faint transition-colors hover:text-ink"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <span className="hidden h-3 w-px bg-line sm:block" />
          <span className="font-mono text-xs text-faint">
            <span className="text-muted">⌘K</span>
          </span>
        </nav>
      </div>
    </header>
  );
}
