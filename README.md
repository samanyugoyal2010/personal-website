# INDEX — a living editorial masthead

A flagship personal website: bold editorial typography fused with a builder's
command surface, and a few things that are genuinely *alive*.

**What makes it distinctive**

- **Cursor-reactive masthead** — your name in a variable serif whose letters
  thicken toward the pointer.
- **Live status line** — your real Spotify track, local time, and what you're
  currently building, right under your name.
- **⌘K command surface** — a fuzzy-search palette *and* a typed terminal
  (`whoami`, `experience`, `research`, `sudo hire-me`, …). Recruiters click; engineers type.
- **Pinned now-playing bar** + **live GitHub contribution graph**.
- One accent color, monospace metadata labels, editorial serif + grotesk + mono.
- Fully responsive, accessible, and fast. Honors `prefers-reduced-motion`.

Built with **Next.js 16 (App Router) · React 19 · Tailwind CSS v4 · Framer Motion · cmdk**.

---

## 1. Quick start

```bash
npm install
npm run dev
# open http://localhost:3000
```

The site works immediately with placeholder content and **no API keys** — the
live widgets simply stay hidden until you add credentials (step 3).

---

## 2. Make it yours — edit ONE file

Everything you'd want to change lives in **`src/content/profile.ts`**: your name,
the manifesto line, experience, research, about, socials, email, SEO. Replace
every `// TODO` and you're done. You never have to touch the design code.

Want to tweak the look?

- **Accent color / palette** → `src/app/globals.css` (the `@theme` block — change
  `--color-accent`). It's referenced in a couple of inline styles too
  (`rgba(255,74,28,…)` in `GitHubActivity.tsx` and `Masthead` uses only weight).
- **Fonts** → `src/app/layout.tsx` (swap `Fraunces` / `Geist` / `Geist_Mono`).

---

## 3. Live integrations (optional)

Copy `.env.example` to `.env.local` and fill in whichever you want. Anything left
blank just stays hidden — nothing breaks.

### Spotify "now playing"

1. Create an app at <https://developer.spotify.com/dashboard>. Copy the
   **Client ID** and **Client Secret**. Add a Redirect URI, e.g.
   `http://127.0.0.1:3000/callback`.
2. Authorize your own account once (scopes: `user-read-currently-playing`
   `user-read-recently-played`). Visit this URL in your browser (fill in your id):

   ```
   https://accounts.spotify.com/authorize?client_id=YOUR_CLIENT_ID&response_type=code&redirect_uri=http://127.0.0.1:3000/callback&scope=user-read-currently-playing%20user-read-recently-played
   ```

   Approve, then copy the `code=` value from the URL you're redirected to.
3. Exchange the code for a **refresh token** (replace the placeholders):

   ```bash
   curl -X POST https://accounts.spotify.com/api/token \
     -H "Content-Type: application/x-www-form-urlencoded" \
     -d grant_type=authorization_code \
     -d code=THE_CODE_FROM_STEP_2 \
     -d redirect_uri=http://127.0.0.1:3000/callback \
     -u YOUR_CLIENT_ID:YOUR_CLIENT_SECRET
   ```

   Copy `refresh_token` from the JSON response.
4. Put all three in `.env.local`:

   ```
   SPOTIFY_CLIENT_ID=...
   SPOTIFY_CLIENT_SECRET=...
   SPOTIFY_REFRESH_TOKEN=...
   ```

The refresh token is long-lived — you set it once.

### GitHub contribution graph

1. Create a **classic** Personal Access Token (read-only) with the `read:user`
   scope: <https://github.com/settings/tokens>.
2. Add it to `.env.local` and set your username in `profile.ts`:

   ```
   GITHUB_TOKEN=...
   ```
   ```ts
   // src/content/profile.ts
   githubUsername: "your-github-username",
   ```

---

## 4. The ⌘K command surface

Press **⌘K** (or **Ctrl-K**), or tap the **menu** button bottom-right.

- **navigate** — fuzzy-search and jump to any section, copy your email, open socials.
- **terminal** — type commands. Try: `help`, `whoami`, `experience`, `cat about`,
  `research`, `socials`, `email`, `goto contact`, and the easter egg `sudo hire-me`.
  Arrow-up recalls history. Tappable chips make it work on mobile.

Commands read straight from `profile.ts`, so they stay correct as you edit content.

---

## 5. Deploy (Vercel)

1. Push to GitHub.
2. Import the repo at <https://vercel.com/new>.
3. Add the same env vars (`SPOTIFY_*`, `GITHUB_TOKEN`) in
   **Project → Settings → Environment Variables**.
4. Deploy, then point your domain at it.

```bash
npm run build   # verify a production build locally first
```

---

## Project structure

```
src/
  app/
    layout.tsx              fonts, metadata, global shell
    page.tsx                the single-page composition
    globals.css             design tokens (palette, fonts, base styles)
    api/now-playing/        Spotify endpoint (serverless)
    api/github/             GitHub endpoint (serverless, cached 1h)
  components/                Masthead, StatusLine, Experience, About, Research,
                             Contact, ActivityOdds, CommandMenu, NowPlayingBar…
  content/profile.ts         ← the only file you need to edit
  lib/                       spotify, github, client hooks
```
