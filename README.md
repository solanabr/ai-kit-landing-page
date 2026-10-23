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

The sync uses `GITHUB_TOKEN`, or a logged-in `gh`, for the GitHub API.

### Kept in sync automatically

`.github/workflows/sync-kit.yml` runs the sync every day at 06:17 UTC, and on demand from the Actions tab (**Sync kit data → Run workflow**). When the kit's content changed, it builds the site and commits the new `kit.json` to `main`, and Vercel deploys that push. A day where only the GitHub star count moved commits nothing, so it costs no deploy; stars refresh with the next real update. A kit release reaches the site within a day.

A red run means the build refused the new data, and the live site stays as it was. The usual cause is a hand-kept table below that no longer matches the kit. Fix it, then run the workflow again.

The kit can trigger the workflow on release instead of waiting for the daily run: a `repository_dispatch` of type `kit-release`, sent from a workflow in the kit with a token that can reach this repo.

Three tables in `src/lib/site.ts` are hand-maintained, because the kit has no machine-readable source for them:

- `TIERS`: the firewall matrix on the homepage, transcribed from the kit's README "Firewall tiers" table and `docs/firewall.md`. It records the kit's `RULE_SET_VERSION` it was checked against, and the build fails when the kit moves past it. Re-check the rows, then bump `TIERS.ruleSetVersion`.
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

## Social preview images

Every page gets a 1200×630 `og:image` at `/og/<path>.png` (`/og/home.png` for `/`), rendered at build by `src/lib/og.ts` with satori and resvg from the same data as the page. `scripts/check-dist.mjs` fails the build when a page's image is missing.

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
