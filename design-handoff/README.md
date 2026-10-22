# Handoff: Solana AI Kit website

## Overview
Marketing and reference site for **Solana AI Kit** (github.com/solanabr/ai-kit, v2.4.0, MIT, by Superteam Brazil): an open-source configuration that turns Claude Code (and Codex, opencode, other agents) into a Solana building partner.

Pages:
1. Homepage `/` (and localized `/br`, pt-BR)
2. Catalogs `/skills`, `/agents`, `/commands` (grid + dense list)
3. Skill pack detail `/skills/<id>`
4. Agent detail `/agents/<name>` and command detail `/commands/<name>` (same template)
5. A plain-Markdown twin of **every** page at `<path>.md`, plus `/llms.txt` and `/llms-full.txt`

Reference for structure and restraint: opencode.ai (terminal-native, few colors, install box as hero CTA, `[*]` bullets, figures instead of logo walls). Do **not** copy its branding or copy.

## About the design files
The files in `design/` are **design references built in HTML**: prototypes showing the intended look, content and behavior. They are not production code. Recreate them in the target stack. If no codebase exists yet, a static-site generator is the right fit (Astro or Next.js static export, or Eleventy). Requirements that drive that choice:

- **Detail pages must be fully static / pre-rendered.** No client-only rendering of content. The HTML page and its `.md` twin carry the same text.
- Both are generated at build from the same data (`skill-registry.json`, the kit's `.claude/agents/*.md`, `.claude/commands/*.md`, the firewall config, and the GitHub API for stars).
- Client JS is only for: copy buttons, tabs, theme toggle, catalog filtering, the transcript typing effect, mobile menu.

To view the prototypes: open `design/Overview.dc.html` in a browser served from the `design/` folder (any static server, e.g. `npx serve design`). It shows every screen at 1440 and 390 in both themes. Each page also opens on its own. `?theme=light` forces the light theme; `Detail.dc.html?kind=skills&id=jupiter`, `?kind=agents&id=anchor-engineer`, `?kind=commands&id=audit-solana`; `Catalog.dc.html?kind=skills|agents|commands&view=grid|list`.

`design/kit-data.js` is the mock data layer and **the Markdown generator reference** (`toMarkdown`, `llmsTxt`, `llmsFull`). `examples/` holds its actual output.

## Fidelity
**High-fidelity.** Colors, type, spacing, copy and interactions are final. Recreate pixel-accurately. Copy marked "draft" or "sample" (see *Data honesty*) must be replaced with real data, not shipped.

---

## Design tokens

### Fonts
| Token | Value | Use |
|---|---|---|
| `--font-heading` | `"VT323", "IBM Plex Mono", ui-monospace, monospace` | H1–H3, list titles, FAQ questions, figures |
| `--mono` | same as heading | nav, labels, tabs, badges, chips, commands, code, captions, `[*]` markers |
| `--font-body` | `"IBM Plex Mono", ui-monospace, SFMono-Regular, Menlo, monospace` (400/500/600 from Google Fonts) | paragraphs, FAQ answers, descriptions |

VT323 is self-hosted (`assets/fonts/`, OFL licence included), three subsets: latin, latin-ext, vietnamese. **Every `@font-face` uses `size-adjust:125%`**, so all px sizes below are *set* sizes; VT323 renders ~25% larger. Copy this exactly:

```css
@font-face{font-family:"VT323";src:url("/fonts/vt323-latin-400-normal.woff2") format("woff2");font-weight:400;font-display:swap;size-adjust:125%;unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD}
/* + latin-ext and vietnamese faces, same pattern; see any design/*.dc.html <style> */
```
VT323 has one weight. Never apply bold to it (no faux bold). For zh/ja/ko the font stack falls back to the system CJK fonts; plan a CJK mono fallback per locale.

### Color (dark is default; `[data-theme="light"]` overrides)
| Token | Dark | Light | Role |
|---|---|---|---|
| `--color-bg` | `#0a0d0b` | `#f2f4f2` | page ground |
| `--color-surface` | `#111613` | `#e7ebe8` | install box, transcript, menus |
| `--color-text` | `#e2ede6` | `#111814` | body, headings |
| `--muted` | `#9daea4` | `#4c5751` | secondary text, captions |
| `--color-accent` | `#14f195` (Solana green) | `#0a8f58` | strokes, `[*]`, focus ring, tab underline, logo |
| `--ink-accent` | `#14f195` | `#08683f` | links, selected labels, accent text |
| `--line-strong` | `#e2ede6` @ 40% | `#111814` @ 52% | control borders |
| `--color-divider` | `#e2ede6` @ 14% | `#111814` @ 16% | hairline rules (decorative) |

All text pairs meet WCAG 2.2 AA (4.5:1) on both bg and surface; accent strokes and control borders meet 3:1. The Components page computes the ratios live. Single accent only, no gradients. Color is applied as strokes, rules and underlines, never as large fills. The one tinted fill is a selected tag chip: `color-mix(in srgb, var(--color-accent) 14%, transparent)`.

Shadows: dark `--shadow-md: 0 8px 24px rgba(0,0,0,.5)`; light `0 3px 10px color-mix(in srgb,#111814 16%,transparent)`. Used only on the language menu.

### Type scale (set sizes)
- H1 hero: `clamp(38px, 5.4vw, 68px)` / line-height .95 / max-width 18ch / weight 400
- H1 catalog & spec pages: `clamp(36px, 4.6vw, 56px)` / 1
- H1 detail: skill `clamp(36px, 4.6vw, 56px)` (heading font); agent/command `clamp(30px, 3.8vw, 46px)` (mono)
- H2 section: `clamp(28px, 3.2vw, 38px)` / 1
- H3 (detail sections): 28px
- List titles ("What's inside" items, FAQ questions, task options): 22px
- Figure numerals: `clamp(44px, 4.6vw, 60px)`, `font-variant-numeric: tabular-nums lining-nums`
- Hero subhead, install box commands, transcript body: **13.5px / 1.45** (these three intentionally match)
- Body paragraphs: 14–15px / 1.55–1.6, max 64ch
- Tabs, nav links, mono links: 13px. Captions, kickers, sidebar keys: 12px. Badges: 11px (10px in list rows).
- Section kickers: `§ 01` … `§ 06`, mono 12px muted.

### Spacing & shape
- Container: `max-width: 1120px; margin: 0 auto; padding: 0 clamp(20px, 5vw, 56px)`
- Section rhythm: `margin-top: clamp(40px, 5vw, 64px); padding-top: clamp(24px, 3vw, 36px); border-top: 1px solid var(--color-divider)`
- Two-column sections: flex-wrap, label column `flex: 1 1 260px`, content `flex: 2.2 1 520px`, gap `16px 48px`
- Radius: sm 2px (badges, chips), md 4px (boxes, buttons, cards)
- Hit targets ≥ 44px on mobile (tabs 40px min on desktop)
- Classical base scale (`--space-1..8`): 4.6 / 9.2 / 13.8 / 18.4 / 27.6 / 36.8px

### Page frame
- **Side lines:** a fixed, full-height, `pointer-events:none` element `width: min(1120px, 100%); margin: 0 auto; border-left/right: 1px solid var(--color-divider)`, so two hairlines run the length of every page along the container edges (opencode-style).
- **Top bar:** sticky, `background: color-mix(in srgb, var(--color-bg) 92%, transparent)` + `backdrop-filter: blur(10px)`. The inner bar is 1120px max, min-height 72px, padding `12px clamp(20px,5vw,56px)`, `border-bottom` hairline spanning only between the side lines.

---

## Shared components
Each is a separate file in `design/` and shown in both themes on `Components and Tokens.dc.html`.

**Nav** (`Nav.dc.html`)
- Left: the wordmark linking home (see *Assets*), 25px tall.
- Right (≥900px): Skills · Agents · Commands · Docs (mono 13px, gap 32px, `aria-current="page"` turns them accent); GitHub link with icon + star badge (dashed border = placeholder `★ ⟨stars⟩` until build fetches a number; then compact format e.g. `★ 1.2K`); language switcher; theme toggle (34px outlined icon button, sun/moon, persists to `localStorage['aikit-theme']`).
- <900px: wordmark, star badge, 44px hamburger → full-width menu below the bar listing links, GitHub, the language switcher and a theme button.

**Install box** (`InstallBox.dc.html`)
- Bordered (`--line-strong`), surface fill, radius 4px. Tablist on top (tabs mono 13px, padding `9px 10px 7px`, active tab = text color + 2px accent underline; inactive = muted).
- Panel: padding `14px clamp(12px,2vw,20px) 16px`; optional caption line (12px muted); each line is `$ ` (or `›` for prompts) in accent + command in text color, 13.5px/1.45, `white-space: pre-wrap; overflow-wrap: anywhere`. The prefix glyph is not copied.
- Copy button on the right: outlined, icon + "Copy" → check icon + "Copied" for 1.8s, label in an `aria-live="polite"` span. Copies all lines joined by `\n`.
- Optional footer note row (hairline top, 12px muted).

**Transcript** (`Transcript.dc.html`). Pure HTML text, not video or GIF.
- Tabs `/plan-feature`, `/audit-solana`, `/deploy`, plus a "Replay" ghost button.
- Line types: `>` command (typed out at 32ms/char with a `▍` caret), `●` step with a padded label (Agent / Skill / Tool / Result / Next; labels in `--ink-accent`, tool bullets muted), `⎿` tool output (muted, indented 22px), indented list lines, `?` waiting line.
- After typing, each remaining line fades in at ~384ms intervals (opacity 0→1). **All lines are in the DOM from the start** (indexable/translatable); motion only reveals them. Under `prefers-reduced-motion: reduce` everything shows immediately.
- `/deploy` includes a **firewall pause card**: accent 1px border, shield icon, title "Firewall · Medium · paused", text "This deploys to mainnet-beta. Confirm to continue.", key/value rows (Program, Cluster, Signer "path only, contents not read"), actions `[y] deploy  [n] cancel  [d] show full command`.
- Caption: "A Claude Code session rendered as text, so it can be translated and indexed. Paths and findings are illustrative."
- Body min-height 250px; exact line content is in `Transcript.dc.html` (EN + pt-BR).

**Catalog card** (`CatalogCard.dc.html`): grid and list variants
- Grid: `.card` bordered, padding `14px 16px 12px`, gap 7px. Title (skill: heading font 22px; agent/command: mono 15px) + Official badge (accent stroke + check icon) + model badge (agents/commands) + dashed "sample" badge when not real data. Maintainer line mono 12px muted (+ "· default" / "· on demand" for skills). Description 14px, clamped to 3 lines. Tag chips. Footer row: sha badge `@ a2211e3` + copy field showing the install command (truncates with ellipsis, shows "copied").
- List: one row per item, wraps: id + badges + maintainer (≈270px) | one-line truncated description | sha badge + 32px copy icon button. Row padding 9px, hairline bottom, faint hover tint.

**Fact sidebar** (`FactSidebar.dc.html`): bordered `<aside>` with a `<dl>`. Keys mono 12px muted; values mono 13px (links in `--ink-accent`); a copy mini-button for the full sha. **Missing data renders as a dashed `⟨field⟩` placeholder, never an invented value.**

**Markdown controls** (`MdControls.dc.html`): `Copy as Markdown` (copies the twin text; "Copied" state), `View .md` (link to raw file), `Open in Claude ↗` → `https://claude.ai/new?q=<encoded prompt>`, `Open in ChatGPT ↗` → `https://chatgpt.com/?q=<encoded prompt>`. Prompt: `Read <md URL> and use it for this session` (pt-BR: `Leia <md URL> e use nesta sessão`). Buttons `white-space: nowrap`, wrap as a group.

**Language switcher** (`LangSwitch.dc.html`): two variants.
- `menu`: native `<details>` disclosure, globe icon + `EN` / `PT-BR` + chevron; panel lists all locales in their own language and script, with path on the right, current marked `›` and `aria-current`. Planned locales (not yet shipped) are listed but not linked: "/es · planned".
- `list`: inline list for the footer.
- Each entry carries `lang` and `hreflang`.

**Badges & tag chips**: mono, 11px, 1px stroke, radius 2px. Official = accent stroke + `--ink-accent` text. Model = `--line-strong` stroke. Sha = divider stroke. Dashed = sample/placeholder. Filter chips are `<button aria-pressed>`; pressed = accent stroke + 14% tint + `--ink-accent` text.

**Footer** (`Footer.dc.html`): wordmark (27px tall) + tagline; columns Kit (Skills, Agents, Commands, Docs), Project (GitHub, Releases, Issues, MIT licence), For agents (`/llms.txt`, `/llms-full.txt`, `/index.md`); "Languages" row with the list switcher; bottom row: "MIT licence" · "Built by Superteam Brazil" · `v2.4.0` · `/llms.txt` link.

Interaction states everywhere: hover = text/border shifts toward `--color-text` / accent; focus = `:focus-visible { outline: 2px solid var(--color-accent); outline-offset: 2px }`; disabled 45% opacity. No default browser focus rings.

---

## Screens

### 1. Homepage `/` (`Home.dc.html`)
Order:
1. **Nav**
2. **Hero**: kicker `v2.4.0 · MIT · open source · Superteam Brazil` (12px muted); H1 **"Claude Code, set up to ship on Solana."**; subhead (13.5px mono, muted, max 72ch): "Open-source agents, workflow commands and pinned skill packs from the Solana ecosystem, for every step from validating the idea to launch."
3. **Install box**, full container width, tabs:
   - `curl` (default): `curl -fsSL https://aikit.superteam.codes | bash`
   - `verify first` (caption "Download, read, then run."): `curl -fsSL https://aikit.superteam.codes/install.sh -o /tmp/solana-ai-kit-install.sh` / `less /tmp/solana-ai-kit-install.sh` / `bash /tmp/solana-ai-kit-install.sh`
   - `codex / opencode` (caption "Adds configuration for Codex, opencode and other agents."): `curl -fsSL https://aikit.superteam.codes | bash -s -- --agents`
   - `no install` (caption "Paste this into any agent. Nothing is written to your project.", `›` prefix): `Read https://aikit.superteam.codes/CLAUDE-solana.md and follow it for this session. We are building on Solana.`
   - Note row: "Run it from your project's root."
   - Below: outlined "View on GitHub" button + "No account, no sign-up." (12px muted)
4. **Transcript demo**, full width, 24–36px below.
5. **§ 01 What's inside**: `[*]` list; every count comes from data: `15 specialized agents` (detail: all agent ids), `34 workflow commands` (detail: examples), `46 skill packs, each pinned to a commit and scanned before it ships` (detail: "4 installed by default, the rest added on demand. From <maintainers> and more."), `4 MCP servers on by default` (Helius (on-chain data), solana-dev (Solana docs), Context7 (library docs), context-mode (context compression)), `4 firewall tiers: Off, Relaxed, Medium, High` (gates mainnet deploys, secret and keypair reads, destructive commands), `Progressive loading` ("Almost none of it enters the model's context until a task needs it.").
6. **§ 02 Figures**: 4 figures, auto-fit grid min 160px. Each: top rule `--line-strong`, numeral, caption `Fig N. <label>` (Fig N. in `--ink-accent`), source line 11px muted. Fig 1 GitHub stars (GitHub API at build), Fig 2 skill packs (registry), Fig 3 ecosystem maintainers (distinct maintainers in the registry), Fig 4 version. Unknown values render as a dashed `⟨stars⟩` box labelled "placeholder". **Never hard-code a number.**
7. **§ 03 Start with your task**: bordered box, left a vertical tablist of 6 tasks (heading font 22px; selected = `›` + `--ink-accent`), right a panel: Agent link, Command link, Packs links, and a "Try" example prompt. Mapping (in `kit-data.js` `TASKS`): Write an Anchor program → anchor-engineer, /build-program, solana-dev; Integrate Jupiter → defi-engineer, /plan-feature, jupiter + solana-dev; Launch a token → token-engineer, /inspect-mint, solana-dev + metaplex; Build a mobile dApp → mobile-engineer, /plan-feature, solana-mobile + solana-dev; Audit before mainnet → solana-qa-engineer, /audit-solana, solana-dev; Ship a hackathon project → solana-architect, /plan-feature, colosseum + solana-dev. **Verify these mappings with the kit maintainers.**
8. **§ 04 Built for mainnet safety**: intro "The firewall decides what an agent may do without asking you. Change the tier with `/firewall`." Compact `.table`: columns Off/Relaxed/Medium/High; rows Mainnet deploys, Secret and keypair reads, Destructive commands; cells "not gated" (muted) / "asks" (text) / "blocks" (`--ink-accent`). Wrapped in `overflow-x:auto`, padding shrinks on mobile. **The cell values are DRAFT. Generate them from the real firewall config.** Then two `[*]` sentences: *Pinned and scanned.* and *Keypair protection.* (exact copy in file). Tone is factual, not fear-driven.
9. **§ 05 Skills from the ecosystem**: maintainer names as text chips (mono 14px, 40px tall, bordered) linking to their pack pages: Solana Foundation, Jupiter, Colosseum, Metaplex, MagicBlock, Helius, Alchemy, SendAI, Solana Mobile, Light Protocol, Circle, Dune. No logos unless the registry marks a logo as permitted (`logoPermitted`). Then a "All 46 skill packs →" link.
10. **§ 06 FAQ**: `<details>` rows with a `[+]` marker: Does it work outside Claude Code? / What does it install, and where? / Does it send my code anywhere? / How do updates work? / What is "no install" mode? Answer copy is in the file; **have maintainers confirm** the install location and update answers.
11. **Footer**

### 2. Catalog `/skills`, `/agents`, `/commands` (`Catalog.dc.html`)
- Header: segmented links `/skills /agents /commands` (current = accent stroke), H1, one-line summary from counts.
- Filter bar (hairlines top and bottom): search input (mono 14px, 44px tall, search icon; matches title, id, description, maintainer); for skills a radiogroup segmented control `All | Installed by default | Add on demand`; grid/list radiogroup toggle; tag chips (multi-select, OR logic): DeFi, NFT, testing, security, mobile, gaming, infra, data, go-to-market.
- Result line `aria-live`: "Showing N of M". Empty state: "No matches. Clear filters".
- Grid: `repeat(auto-fill, minmax(min(100%,300px),1fr))`, gap 12px. List: stacked rows.
- Filtering is client-side over a pre-rendered list (all items in the static HTML).

### 3. Skill pack detail `/skills/<id>` (`Detail.dc.html?kind=skills&id=jupiter`)
Field order (follows skills.sh):
- Breadcrumb `aikit / skills / jupiter`
- H1 name; byline `by jup-ag`; Official badge; tag chips (link to filtered catalog)
- Two-column grid `minmax(0,1fr) 300px`, gap `40px 56px`; sidebar sticky at top 84px. <900px: single column, sidebar moves directly under the install section.
- **Install** box tabs: `Installed kit` → `bash .claude/bin/skills.sh add jupiter`; `No install` → the `.md` URL (caption "Give this URL to any agent that can fetch."). Markdown controls below.
- Description paragraph (15–17px).
- **Use it when…**: `[*]` grid built from `triggers`.
- **What's inside (N)**: each contained skill is a `<details>` row: id (mono) + `[+]`; expanded shows description + `skills/<id>/SKILL.md` path.
- **Safety review @ a2211e3**: bordered box, shield-check icon + one-line summary, then a "Read the full review [+]" `<details>` with the full prose paragraphs (justified, muted). From the registry `safety` field.
- **Used by**: dl rows Agents / Commands with links.
- **Related packs**: up to 3 catalog cards sharing a tag.
- Footer row: "Edit this page on GitHub" (pencil icon, to the registry file) + language switcher.
- **Fact sidebar**: Source repo (link), Pinned commit (full sha + copy), Licence, Upstream stars, Upstream last commit, Pinned by the kit (date), Tier.

### 4. Agent & command detail (`?kind=agents&id=anchor-engineer`, `?kind=commands&id=audit-solana`)
Same template with these changes:
- Title in mono with a `/` prefix for commands; byline `solanabr/ai-kit · agent|command`; **model badge** `model: opus|sonnet|inherit`.
- Install box becomes **How to invoke**: agent → prompt `Use the anchor-engineer agent to …`; command → `/audit-solana [path]`; plus the No install tab.
- "What's inside" becomes **What it does**: numbered `01 02 …` list. Commands add "Routes to <agent>".
- **Hands off to…**: chips with `→` linking to agents.
- "Used by" becomes **Uses** (Skills, Commands, or Agents).
- No safety review section.
- Sidebar: Model, File (link to `.claude/agents/<id>.md`), Licence, Kit version / Routes to.

### 5. Localized homepage `/br` (`Home pt-BR.dc.html`)
Same layout, full pt-BR copy (~30% longer; verified it fits at 390 and 1440). **Commands, code, file paths, agent/command ids and tier names stay in English** in every locale. `<html lang="pt-BR">`. Planned locales: /es, /zh, /ja, /ko, /tr, /vi.

hreflang (every page, mirrored per locale):
```html
<link rel="alternate" type="text/markdown" href="https://aikit.superteam.codes/skills/jupiter.md">
<link rel="alternate" hreflang="en" href="https://aikit.superteam.codes/skills/jupiter">
<link rel="alternate" hreflang="pt-BR" href="https://aikit.superteam.codes/br/skills/jupiter">
<link rel="alternate" hreflang="es" href="https://aikit.superteam.codes/es/skills/jupiter">
<link rel="alternate" hreflang="zh-Hans" href="https://aikit.superteam.codes/zh/skills/jupiter">
<link rel="alternate" hreflang="ja" href="https://aikit.superteam.codes/ja/skills/jupiter">
<link rel="alternate" hreflang="ko" href="https://aikit.superteam.codes/ko/skills/jupiter">
<link rel="alternate" hreflang="tr" href="https://aikit.superteam.codes/tr/skills/jupiter">
<link rel="alternate" hreflang="vi" href="https://aikit.superteam.codes/vi/skills/jupiter">
<link rel="alternate" hreflang="x-default" href="https://aikit.superteam.codes/skills/jupiter">
```
Only emit alternates for locales that actually exist at build time.

### 6. Markdown twins (`Markdown Twins.dc.html`, `examples/`)
- Every HTML page has a twin at the same path + `.md` (`/` → `/index.md`; `/br/skills/jupiter` → `/br/skills/jupiter.md`). Serve as `text/markdown; charset=utf-8`; `/llms*.txt` as `text/plain; charset=utf-8`.
- Format: YAML frontmatter with **stable keys**, then sections in the HTML's order. Skill pack keys: `id, name, type: skill-pack, maintainer, official, license, source, commit (full sha), install, url`. Agents: `id, name, type: agent, model, license, source, invoke, url`. Commands: `id, name, type: command, model, license, source, invoke, url`.
- Sections (skill): `# Name`, description, `## Use it when`, `## Install`, `## What's inside`, `## Safety review`, `## Used by`. Exact output: `examples/skills/jupiter.md`.
- `/llms.txt`: title, `>` summary, pointer to llms-full, then `## Agents`, `## Commands`, `## Skills`, one line each: `- [Title](md URL): description`. See `examples/llms.txt`.
- `/llms-full.txt`: every twin concatenated, each preceded by `<!-- <md URL> -->`. See `examples/llms-full.txt`.
- Generate the HTML and the twin from the **same data object** in the same build step so they cannot drift.

---

## Interactions & behavior
- **Theme:** default dark. Toggle writes `data-theme` on `<html>` and `localStorage['aikit-theme']`. Respect `prefers-color-scheme` on first visit if you like, but dark is the brand default. Set the attribute before first paint (inline head script) to avoid a flash.
- **Copy buttons:** `navigator.clipboard.writeText`, then the "Copied" state for 1.6–1.8s, announced via `aria-live="polite"`.
- **Tabs:** `role="tablist"/"tab"/"tabpanel"`, `aria-selected`. Add arrow-key navigation in production.
- **Transcript:** see component spec. Restart on tab change or Replay. No other heavy motion on the site. No GIFs.
- **FAQ / "What's inside" / safety review / language menu:** native `<details>`, which works without JS.
- **Responsive:** single breakpoint at 900px for nav and detail sidebar; everything else is fluid (flex-wrap, auto-fit grids, clamp()). Check at 390 and 1440.

## Data honesty (must keep)
- No sign-up, email capture, pricing, cookie wall, testimonials, user counts or partner logos.
- Every number comes from data. Unknown values render as a dashed `⟨field⟩` placeholder with a "placeholder" label.
- In the mocks, only `solana-dev` and `jupiter` carry real registry data (see `kit-data.js`). Everything flagged `sample: true` or labelled "Draft" is invented filler: the other packs' fields, agent/command descriptions, models, "does" lists, hand-offs, both safety review texts, firewall tier values, task mappings, the transcript's illustrative output, and the `vrfd` skill description. Replace all of it with real data at build. Remove the "sample"/"draft" badges once real data is wired in.

## State
- Theme (`dark|light`, persisted).
- Install box / transcript / task picker: selected tab index (local).
- Catalog: `q` (string), `tags` (string[]), `def` (`all|default|demand`), `view` (`grid|list`). Consider reflecting them in the URL query.
- Build-time data: registry entries (`id, name, description, triggers, tags, tier, default_installed, source, commit, license, maintainer, signal.stars, signal.last_commit, signal.reputability, install.command, safety`), agents, commands, firewall tiers, GitHub stars, version.

## Assets
- `assets/wordmark.svg`: pixel-art logo (Solana-style three-bar mark + "AI KIT") with a 3D extrusion: two copies offset (1,1) and (2,2) cells at 55% and 30% accent mixed into bg. In the HTML it's inlined so the colors follow the theme tokens (see `Nav.dc.html`). Use `role="img" aria-label="Solana AI Kit"`. Render with `shape-rendering: crispEdges`.
- `assets/logo.svg`: three-bar mark alone. **Favicon** (`<link rel="icon" type="image/svg+xml" href="/logo.svg">`); also export 32/180px PNGs for Apple touch / legacy.
- `assets/fonts/`: VT323 woff2 subsets + OFL licence.
- Icons: Lucide (github, globe, chevron-down, sun, moon, menu, x, copy, check, search, layout-grid, list, file-text, shield-alert, shield-check, pencil, rotate-ccw), stroke 1.75.
- ⚠️ The three-bar mark was redrawn from a watermarked stock image, and it is Solana's logo mark. Get brand clearance from Solana, or commission an original mark, before launch.

## Files
- `design/Overview.dc.html`: all screens, 1440/390, both themes
- `design/Home.dc.html`, `design/Home pt-BR.dc.html`
- `design/Catalog.dc.html`
- `design/Detail.dc.html` (skill / agent / command via query string)
- `design/Markdown Twins.dc.html`: URL map, head spec, twin frames, llms files
- `design/Components and Tokens.dc.html`: token tables with contrast ratios, every component in both themes
- `design/Nav, Footer, InstallBox, Transcript, CatalogCard, MdControls, FactSidebar, LangSwitch .dc.html`: components
- `design/kit-data.js`: mock data + Markdown/llms generators (reference implementation)
- `design/_ds/…/styles.css`: base Classical design system (provides `.btn`, `.card`, `.table`, `.seg`, `.input`, `.nav` classes; its tokens are overridden by each page's `<style>` block)
- `examples/`: generated `.md` twins, `llms.txt`, `llms-full.txt`
