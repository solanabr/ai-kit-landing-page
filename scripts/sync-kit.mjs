#!/usr/bin/env node
// Builds src/data/kit.json from the Solana AI Kit repository, so every number,
// name and description on the site comes from the kit rather than from copy.
//
//   KIT_DIR=../ai-kit node scripts/sync-kit.mjs      read a local clone
//   KIT_REF=v2.4.0 node scripts/sync-kit.mjs         clone that ref (default: latest release tag)
//
// GITHUB_TOKEN (or a logged-in `gh`) raises the GitHub API rate limit; the
// script needs it for the star count and for each pack's skill list.
import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'src/data/kit.json');
const REPO = 'solanabr/ai-kit';

const sh = (cmd, args, opts = {}) => execFileSync(cmd, args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], ...opts }).trim();

function token() {
  if (process.env.GITHUB_TOKEN) return process.env.GITHUB_TOKEN;
  try { return sh('gh', ['auth', 'token']); } catch { return ''; }
}
const TOKEN = token();

async function gh(path) {
  const res = await fetch('https://api.github.com/' + path, {
    headers: { accept: 'application/vnd.github+json', ...(TOKEN ? { authorization: 'Bearer ' + TOKEN } : {}) }
  });
  if (!res.ok) throw new Error(`GitHub API ${path}: ${res.status}`);
  return res.json();
}

async function raw(owner, repo, ref, path) {
  const res = await fetch(`https://raw.githubusercontent.com/${owner}/${repo}/${ref}/${path}`);
  return res.ok ? res.text() : '';
}

// --- locate the kit -------------------------------------------------------
let kitDir = process.env.KIT_DIR;
let cleanup = null;
if (!kitDir) {
  let ref = process.env.KIT_REF;
  // The highest vX.Y.Z tag, which is what install.sh installs. GitHub's
  // "latest release" lags behind the tags, so it is not used.
  if (!ref) {
    const tags = sh('git', ['ls-remote', '--tags', '--refs', `https://github.com/${REPO}.git`])
      .split('\n').map(l => l.split('refs/tags/')[1]).filter(t => /^v\d+\.\d+\.\d+$/.test(t || ''));
    const num = t => t.slice(1).split('.').map(Number);
    ref = tags.sort((a, b) => { const x = num(a), y = num(b); return x[0] - y[0] || x[1] - y[1] || x[2] - y[2]; }).pop();
  }
  console.log(`kit ref ${ref}`);
  kitDir = mkdtempSync(join(tmpdir(), 'aikit-'));
  cleanup = kitDir;
  // Full history (blobless) so pin dates can be read from the registry's log.
  sh('git', ['clone', '--quiet', '--filter=blob:none', '--branch', ref, `https://github.com/${REPO}.git`, kitDir]);
}
const kit = p => join(kitDir, p);
const read = p => readFileSync(kit(p), 'utf8');

// --- tiny frontmatter + markdown helpers ----------------------------------
function frontmatter(text) {
  const m = text.match(/^---\n([\s\S]*?)\n---\n?/);
  const data = {};
  if (m) {
    for (const line of m[1].split('\n')) {
      const kv = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
      if (!kv) continue;
      let v = kv[2].trim();
      if (/^".*"$/.test(v)) v = JSON.parse(v);
      else if (/^'.*'$/.test(v)) v = v.slice(1, -1).replace(/''/g, "'");
      data[kv[1]] = v;
    }
  }
  return { data, body: m ? text.slice(m[0].length) : text };
}

// Markdown inline -> plain text: links keep their label, emphasis is dropped,
// inline code keeps its content.
const plain = s => s
  .replace(/```[\w-]*/g, '')
  .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
  .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
  .replace(/\*\*([^*]+)\*\*/g, '$1')
  .replace(/(^|\W)\*([^*]+)\*(?=\W|$)/g, '$1$2')
  .replace(/`([^`]+)`/g, '$1')
  .replace(/<!--[\s\S]*?-->/g, '')
  .replace(/\s+/g, ' ')
  .trim();

function sections(body) {
  const out = { _intro: [] };
  let cur = '_intro';
  for (const line of body.replace(/<!--[\s\S]*?-->/g, '').split('\n')) {
    const h = line.match(/^##\s+(.+)$/);
    if (h) { cur = h[1].trim(); out[cur] = []; continue; }
    out[cur].push(line);
  }
  return out;
}

const firstParagraph = lines => {
  const para = [];
  for (const l of lines) {
    if (!l.trim()) { if (para.length) break; continue; }
    if (/^(#|- |\d+\.|\||```)/.test(l.trim())) { if (para.length) break; continue; }
    para.push(l.trim());
  }
  return plain(para.join(' '));
};

// Top-level list items of a section ("1. ..." or "- ..."), continuation lines
// folded in. An item that ends in ":" introduces a nested list, so the nested
// items are joined onto it; otherwise they are detail and dropped.
function topItems(lines) {
  const items = [];
  for (const l of lines) {
    const m = l.match(/^(?:\d+\.|-)\s+(.*)$/);
    if (m) { items.push({ text: m[1], kids: [] }); continue; }
    if (!items.length) continue;
    const cur = items[items.length - 1];
    const kid = l.match(/^\s+(?:\d+\.|-)\s+(.*)$/);
    if (kid) cur.kids.push(kid[1]);
    else if (/^\s{2,}\S/.test(l) && !cur.kids.length) cur.text += ' ' + l.trim();
  }
  return items.map(({ text, kids }) => {
    let t = plain(text);
    // A short nested list is joined in full; a long one (a checklist) is
    // named by its labels ("Owner: ..." -> "Owner") so the step stays one line.
    if (/:$/.test(t) && kids.length) {
      const pk = kids.map(plain);
      t += kids.length <= 4
        ? ' ' + pk.map(k => (sentences(k)[0] || k).replace(/[.;]$/, '')).join('; ') + '.'
        : ' ' + pk.map(k => (k.match(/^([^:]{1,40}):\s/) || [])[1] || sentences(k)[0] || k).join(', ') + '.';
    }
    return t;
  });
}

// Split on sentence ends only: "3.x", "Next.js" and "CLAUDE.md" have no space
// after the dot, so they stay whole.
const sentences = s => s.split(/(?<=[.!?])\s+(?=[A-Z`"(\[])/).map(x => x.trim()).filter(Boolean);

// One short line per step: the first sentence, or two when the first is a
// bare label such as "Branch." or "Preflight.".
function lead(s) {
  const ss = sentences(s);
  let out = ss[0] || s;
  if (out.split(/\s+/).length <= 3 && ss[1]) out += ' ' + ss[1];
  return out.replace(/\$ARGUMENTS/g, 'the arguments');
}

// --- registry ---------------------------------------------------------------
const registry = JSON.parse(read('.claude/skills/skill-registry.json'));
const pinned = registry.entries.filter(e => e.tier === 'core' || e.tier === 'extension');
const version = read('.claude/VERSION').trim().split(/\s+/).pop();

// First commit date at which the registry carried this pack at its current pin.
function pinnedAt(sha) {
  try {
    const out = sh('git', ['-C', kitDir, 'log', '--reverse', '--format=%cs', '-S', sha, '--', '.claude/skills/skill-registry.json']);
    return out.split('\n')[0] || null;
  } catch { return null; }
}

// --- agents and commands ------------------------------------------------------
const agentIds = readdirSync(kit('.claude/agents')).filter(f => f.endsWith('.md')).map(f => f.slice(0, -3)).sort();
const commandIds = readdirSync(kit('.claude/commands')).filter(f => f.endsWith('.md')).map(f => f.slice(0, -3)).sort();
const packIds = new Set(pinned.map(p => p.id));

const extPacks = body => [...new Set([...body.matchAll(/skills\/ext\/([a-z0-9-]+)\//g)].map(m => m[1]).filter(id => packIds.has(id)))];
const mentionedCommands = (body, self) => [...new Set([...body.matchAll(/(?:^|[\s`(])\/([a-z][a-z0-9-]+)(?=[\s`),.:;]|$)/gm)].map(m => m[1]).filter(id => commandIds.includes(id) && id !== self))];
const mentionedAgents = (body, self) => agentIds.filter(id => id !== self && new RegExp('(^|[^a-z0-9-])' + id + '([^a-z0-9-]|$)').test(body));

const agents = agentIds.map(id => {
  const file = `.claude/agents/${id}.md`;
  const { data, body } = frontmatter(read(file));
  const sec = sections(body);
  const handKey = Object.keys(sec).find(k => /^hand-?offs?/i.test(k));
  const handoffs = [];
  for (const it of handKey ? topItems(sec[handKey]) : []) {
    const to = agentIds.find(a => new RegExp('(^|[^a-z0-9-])' + a + '([^a-z0-9-]|$)').test(it) && a !== id);
    if (to && !handoffs.some(h => h.to === to)) handoffs.push({ to, when: it.replace(new RegExp('[:,]?\\s*' + to + '.*$'), '').trim() });
  }
  return {
    id, file,
    description: data.description || '',
    model: data.model || 'inherit',
    does: sentences(firstParagraph(sec._intro)).map(x => x.replace(/\$ARGUMENTS/g, 'the arguments')),
    handoffs: handoffs.length ? handoffs : mentionedAgents(body, id).map(to => ({ to, when: '' })),
    skills: extPacks(body),
    commands: mentionedCommands(body, id)
  };
});

const commands = commandIds.map(id => {
  const file = `.claude/commands/${id}.md`;
  const { data, body } = frontmatter(read(file));
  const sec = sections(body);
  const stepsKey = Object.keys(sec).find(k => /^steps?$|^workflow$|^process$/i.test(k));
  const steps = stepsKey ? topItems(sec[stepsKey]).map(lead) : [];
  return {
    id, file,
    description: data.description || '',
    model: data.model || 'inherit',
    argumentHint: data['argument-hint'] || '',
    userOnly: data['disable-model-invocation'] === 'true',
    does: steps.length ? steps : sentences(firstParagraph(sec._intro)).map(lead),
    agents: mentionedAgents(body, id),
    skills: extPacks(body),
    commands: mentionedCommands(body, id)
  };
});

// --- packs ----------------------------------------------------------------------
async function packSkills(p) {
  const m = (p.source || '').match(/^https:\/\/github\.com\/([^/]+)\/([^/#?]+)/);
  if (!m) return [];
  const [, owner, repo] = m;
  const ref = p.commit;
  if (!ref) return [];
  let paths;
  try {
    const tree = await gh(`repos/${owner}/${repo}/git/trees/${ref}?recursive=1`);
    paths = tree.tree.filter(t => t.type === 'blob' && /(^|\/)SKILL\.md$/.test(t.path)).map(t => t.path);
  } catch (e) {
    console.warn(`  ${p.id}: could not list skills (${e.message})`);
    return [];
  }
  // A pack's own nested .claude/ copy and test fixtures are not skills it ships.
  paths = paths.filter(x => !/(^|\/)(\.claude|node_modules|test|tests|fixtures|examples?)\//.test(x));
  if (p.skills) paths = paths.filter(x => p.skills.some(s => x === `skills/${s}/SKILL.md` || x.endsWith(`/${s}/SKILL.md`)));
  const out = [];
  for (const path of paths.sort()) {
    const { data } = frontmatter(await raw(owner, repo, ref, path));
    const dir = path.replace(/\/?SKILL\.md$/, '');
    const name = data.name || dir.split('/').pop() || p.id;
    if (out.some(s => s.id === name)) continue;
    out.push({ id: name, description: data.description || '', path });
  }
  return out;
}

const usedBy = id => ({
  agents: agents.filter(a => a.skills.includes(id)).map(a => a.id),
  commands: commands.filter(c => c.skills.includes(id)).map(c => c.id)
});

const packs = [];
for (const p of pinned) {
  process.stdout.write(`pack ${p.id}\n`);
  packs.push({
    id: p.id,
    name: p.name,
    description: p.description,
    triggers: p.triggers || [],
    tags: p.tags || [],
    tier: p.tier,
    defaultInstalled: !!p.default_installed,
    source: p.source || null,
    commit: p.commit || null,
    license: p.license || null,
    maintainer: p.maintainer || null,
    official: (p.signal && p.signal.reputability) === 'official',
    stars: p.signal && p.signal.stars != null ? p.signal.stars : null,
    lastCommit: (p.signal && p.signal.last_commit) || null,
    install: (p.install && p.install.command) || `bash .claude/bin/skills.sh add ${p.id}`,
    safety: p.safety || null,
    pinnedAt: p.commit ? pinnedAt(p.commit) : null,
    inside: await packSkills(p),
    usedBy: usedBy(p.id)
  });
}

// --- MCP servers and stars ----------------------------------------------------------
const mcp = Object.keys(JSON.parse(read('.mcp.json')).mcpServers || {});
let stars = null;
try { stars = (await gh(`repos/${REPO}`)).stargazers_count; } catch (e) { console.warn('stars: ' + e.message); }

const kitCommit = (() => { try { return sh('git', ['-C', kitDir, 'rev-parse', 'HEAD']); } catch { return null; } })();

writeFileSync(OUT, JSON.stringify({
  generatedAt: new Date().toISOString().slice(0, 10),
  kitCommit, version, stars, mcp,
  agents, commands, packs
}, null, 2) + '\n');
console.log(`wrote ${OUT}: ${agents.length} agents, ${commands.length} commands, ${packs.length} packs, stars ${stars}`);

if (cleanup && existsSync(cleanup)) rmSync(cleanup, { recursive: true, force: true });
