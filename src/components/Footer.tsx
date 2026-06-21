import { profile } from "@/content/profile";

export function Footer() {
  return (
    <footer className="border-t border-line py-10">
      <div className="flex flex-col items-start justify-between gap-4 font-mono text-xs text-faint sm:flex-row sm:items-center">
        <span>
          © {profile.name} — built from scratch.
        </span>
        <span className="flex items-center gap-4">
          <span>press ⌘K anywhere</span>
          <a href="#main" className="transition-colors hover:text-ink">
            back to top ↑
          </a>
        </span>
      </div>
    </footer>
  );
}
