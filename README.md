# Ramachandramoorthi M — Portfolio

Personal site for a software engineer working in Elixir/Phoenix, Vue 3, React and PostgreSQL.
Single-page React app, built with Vite. No backend; the contact form posts through EmailJS.

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # type-check + production build to dist/
npm run preview   # serve dist/ locally
npm run lint
```

## Editing content

All copy and data live in `src/content/` — components never hard-code facts.

| File | What it holds |
| --- | --- |
| `profile.ts` | Name, role, statement, contact channels, working principles, résumé path |
| `experience.ts` | Roles (with impact metrics) and education |
| `projects.ts` | Case studies: problem, approach, contribution, architecture diagram, decisions, links |
| `media.ts` | Screenshot imports and alt text |
| `stack.ts` | Technologies, grouped, each tied to the projects/roles where it was used |
| `approach.ts` | Engineering-notebook entries |
| `navigation.ts` | Section ids, labels and order |

- **Links that aren't public** (private repos, offline demos) use `{ label, unavailable: 'reason' }` in a
  project's `links` — they render as a labelled note instead of a dead link.
- **Images**: add WebP files to `src/assets/work/` at 1600px and 800px wide and register them in `media.ts`.
  `design/` holds full-resolution originals and is not bundled.
- **Résumé**: served from `public/Ramachandramoorthi_.pdf` (path set in `profile.ts`).

## Architecture

```
src/
  content/        typed data — the single source of truth
  styles/         design tokens (both themes), type scale, utilities
  lib/            boot sequence, smooth scroll, EmailJS, small utilities
  hooks/          media queries, active section, connectors, focus trap, …
  providers/      theme (persisted, follows OS until chosen) and UI state (palette, case studies, toasts)
  components/
    primitives/   Button, Magnetic, Reveal, SplitReveal, TiltCard, Counter, SectionHeader, Icon, Chip
    chrome/       navigation + mobile dock, command palette (⌘/Ctrl K), cursor, toasts, footer
    sections/     hero (canvas scene), profile, work (+ case study overlay), career, approach (+ simulator), stack, contact
```

- **Hero scene** (`sections/hero/stackScene.ts`): a dependency-free Canvas 2D renderer with manual
  perspective projection. It pauses off-screen and in hidden tabs, and renders one static frame under
  `prefers-reduced-motion`.
- **Lifecycle simulator** (`sections/approach/simulation.ts`): a pure reducer modelling the Helpdesk ticket
  workflow (round-robin assigner, SLA job, resolution stats). Lazy-loaded and warmed at idle time.
- **Case studies** open in a dialog synced to `?case=<slug>`, so they are shareable and the back button
  closes them.
- **Loading**: the boot overlay in `index.html` covers real work (app mount, fonts, first scene frame).
  Below-the-fold sections mount progressively in React transitions.

## Contact form

EmailJS with the template fields `name`, `email`, `title`, `message`. The IDs default to the existing
account and can be overridden at build time:

```
VITE_EMAILJS_SERVICE_ID=…
VITE_EMAILJS_TEMPLATE_ID=…
VITE_EMAILJS_PUBLIC_KEY=…
```

## Deployment

The output is static (`dist/`). Hosting at a sub-path (for example GitHub Pages project sites) needs
`base: '/<repo>/'` in `vite.config.ts`. Update `og:image` in `index.html` to an absolute URL once the
domain is known.

## Quality bar

- Lighthouse-style lab run on the production build: LCP ≈ 0.3 s on desktop and ≈ 1.0 s on mobile
  (4× CPU, slow 4G); CLS 0; TBT under 120 ms throttled; scrolling at about 60 fps.
- Keyboard: skip link, visible focus, focus trapping and restoring in dialogs, ⌘/Ctrl K palette.
- Both themes are designed separately ("graphite" dark, "paper" light) and meet WCAG AA contrast for text.
