# Solana AI Kit website

The marketing and reference site for [Solana AI Kit](https://github.com/solanabr/ai-kit): a homepage (`/`, `/br`), catalogs (`/skills`, `/agents`, `/commands`) and one page per skill pack, agent and command. Every page has a plain-Markdown twin at the same path plus `.md`, and agents get `/llms.txt` and `/llms-full.txt`.

Built with [Astro](https://astro.build) as a fully static site. The only client JavaScript is for copy buttons, tabs, the theme toggle, the mobile menu, catalog filtering and the demo transcript's reveal; all content is in the HTML.

## Data comes from the kit

Nothing about agents, commands or packs is written by hand. `npm run sync` reads the kit and writes `src/data/kit.json`, which every page and every Markdown twin is rendered from:

| Field | Source |
|-------|--------|
| Version | `.claude/VERSION` at the highest `vX.Y.Z` tag (what `install.sh` installs) |
| Agents, commands | frontmatter and body of `.claude/agents/*.md`, `.claude/commands/*.md` |
| Skill packs | `.claude/skills/skill-registry.json` entries with tier `core` or `extension` |
| What's inside a pack | each `SKILL.md` in the pack's repo at its pinned commit (GitHub API) |
| Pinned by the kit | first registry commit that carried the pack at its current pin |
| Used by | `skills/ext/<pack>/` links in agent and command bodies |
| GitHub stars | GitHub API, at sync time |

```bash
npm install
npm run sync                     # clone the kit at its latest tag
KIT_DIR=../ai-kit npm run sync   # or read a local clone
KIT_REF=v2.4.0 npm run sync      # or a specific ref
npm run dev
npm run build                    # also checks every page has its .md twin
```

The sync uses `GITHUB_TOKEN`, or a logged-in `gh`, for the GitHub API. Re-run it after each kit release and commit the new `kit.json`.

Three tables in `src/lib/site.ts` are hand-maintained, because the kit has no machine-readable source for them:

- `TIERS`: the firewall matrix on the homepage, transcribed from the kit's README "Firewall tiers" table and `docs/firewall.md`. Re-check it when the kit's `RULE_SET_VERSION` moves.
- `TASKS`: the "Start with your task" mappings. The build fails if one names an agent, command or pack the kit no longer ships.
- `ECOSYSTEM`: display names for the maintainer chips.

## Markdown twins

| HTML | Markdown |
|------|----------|
| `/` | `/index.md` |
| `/br` | `/br/index.md` |
| `/skills` | `/skills.md` |
| `/skills/jupiter` | `/skills/jupiter.md` |
| `/agents/anchor-engineer` | `/agents/anchor-engineer.md` |
| `/commands/audit-solana` | `/commands/audit-solana.md` |

Each twin starts with YAML frontmatter whose keys stay stable, so agents can parse them: `id, name, type, maintainer, official, license, source, commit, install, url` for a pack; `id, name, type, model, license, source, invoke, url` for an agent or command. The generator is `src/lib/data.ts`. HTML pages link their twin with `<link rel="alternate" type="text/markdown">`.

## Locales

English at `/` and Brazilian Portuguese at `/br` (homepage). Catalog and detail pages are English only for now, since their text comes from the kit. Commands, code, file paths and ids stay in English in every locale. To add a locale, add its strings to `src/lib/i18n.ts`, set `live: true` in `LOCALES` (`src/lib/site.ts`) and add a `src/pages/<code>/` route. hreflang alternates are emitted only for live locales.

## Deploying

The site is served at `ai.superteam.codes`, which is the default `SITE_URL`. `SITE_URL` sets the absolute URLs in the twins, canonical links and hreflang. `vercel.json` serves `.md` as `text/markdown` and `llms*.txt` as `text/plain`.

`superteam.codes` is on Vercel's nameservers with a wildcard record. Adding the domain under the Vercel project's **Settings → Domains** is the whole setup; no DNS change is needed.

`aikit.superteam.codes` stays with the kit repository's own Vercel project. It serves the installer (`curl -fsSL https://aikit.superteam.codes | bash`) and the kit's raw files, which no-install mode and plugin installs fetch. The site links to it, and nothing here changes it.

## Design

`design-handoff/` is the Claude Design handoff this site implements: HTML prototypes of every screen, the token spec and example Markdown output. It is reference only and is not built. The stylesheet in `src/styles/site.css` ports its tokens and component styles. `src/styles/ds.css` is the base "Classical" design system those prototypes load.

The lockup is in `design-handoff/update-logo/`. It uses Solana's three-bar mark, which Superteam is cleared to use.

## Licence

MIT. VT323 is under the SIL Open Font License (`public/fonts/VT323-LICENSE.txt`). Icons are from Lucide (ISC).
