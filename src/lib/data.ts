// The one data layer every HTML page and every Markdown twin reads, so the two
// cannot drift: a page and its .md are rendered from the same objects.
import kit from '../data/kit.json';
import { ECOSYSTEM, INSTALL_HOST, MCP_ROLES, PACK_NAMES, REPO, SITE, TAGS, TASKS, TIERS, type Kind, type Lang } from './site';

export type Pack = (typeof kit.packs)[number];
export type Agent = (typeof kit.agents)[number];
export type Command = (typeof kit.commands)[number];

export const KIT = kit;
export const packs: Pack[] = kit.packs.map(p => ({ ...p, name: PACK_NAMES[p.id] ?? p.name }));
export const agents: Agent[] = kit.agents;
export const commands: Command[] = kit.commands;

export const pack = (id: string) => packs.find(p => p.id === id);
export const agent = (id: string) => agents.find(a => a.id === id);
export const command = (id: string) => commands.find(c => c.id === id);

export const counts = {
  agents: agents.length,
  commands: commands.length,
  packs: packs.length,
  defaultPacks: packs.filter(p => p.defaultInstalled).length,
  mcp: kit.mcp.length,
  firewallTiers: 4,
  maintainers: new Set(packs.map(p => p.maintainer).filter(Boolean)).size
};

// Fail the build when a hand-maintained table points at something the kit no
// longer ships, instead of rendering a dead link.
for (const t of TASKS) {
  if (!agent(t.agent)) throw new Error(`TASKS ${t.id}: no agent ${t.agent}`);
  if (!command(t.command)) throw new Error(`TASKS ${t.id}: no command ${t.command}`);
  for (const p of t.packs) if (!pack(p)) throw new Error(`TASKS ${t.id}: no pack ${p}`);
}
if (kit.ruleSetVersion !== TIERS.ruleSetVersion) {
  throw new Error(`The kit's firewall rule set is v${kit.ruleSetVersion}, but the homepage tier table (TIERS in src/lib/site.ts) was transcribed for v${TIERS.ruleSetVersion}. Re-check it against the kit's README and docs/firewall.md, then bump TIERS.ruleSetVersion.`);
}
export const ecosystem = ECOSYSTEM.filter(e => packs.some(p => p.id === e.pack && p.maintainer === e.maintainer));
export const mcpList = kit.mcp.map(id => MCP_ROLES[id] || { name: id, en: '', br: '' });

// --- URLs -------------------------------------------------------------------------
export const localePrefix = (lang: Lang) => (lang === 'br' ? '/br' : '');
export const pagePath = (kind: Kind, id: string) => `/${kind}/${id}`;
export const pageUrl = (kind: Kind, id: string) => SITE + pagePath(kind, id);
export const mdUrl = (kind: Kind, id: string) => pageUrl(kind, id) + '.md';
export const catalogPath = (kind: Kind) => `/${kind}`;
export const fileUrl = (file: string) => `${REPO}/blob/v${kit.version}/${file}`;
export const editUrl = (file: string) => `${REPO}/edit/main/${file}`;

export const shortSha = (sha: string | null) => (sha ? sha.slice(0, 7) : null);

export const packTags = (p: Pack) => TAGS.filter(t => t.match.some(m => p.tags.includes(m))).map(t => t.label);

export const invokeLine = (kind: Kind, id: string) =>
  kind === 'agents' ? `Use the ${id} agent to …` : kind === 'commands' ? `/${id}` : pack(id)?.install || '';

// The registry's safety field is one long paragraph. The first sentence is the
// summary line; the rest is the full review.
export function safetyParts(text: string | null) {
  if (!text) return null;
  const ss = text.split(/(?<=[.!?])\s+(?=[A-Z`"(])/);
  const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
  return { summary: cap(ss[0]), full: ss.slice(1) };
}

// --- catalog cards -------------------------------------------------------------------
export interface Card {
  id: string; title: string; href: string; maintainer: string; official: boolean; desc: string;
  sha: string | null; model: string | null; tags: string[]; install: string; def: boolean;
}

export function cards(kind: Kind): Card[] {
  if (kind === 'agents') return agents.map(a => ({ id: a.id, title: a.id, href: pagePath('agents', a.id), maintainer: 'solanabr/ai-kit', official: false, desc: a.description, sha: null, model: a.model, tags: [], install: invokeLine('agents', a.id), def: true }));
  if (kind === 'commands') return commands.map(c => ({ id: c.id, title: '/' + c.id, href: pagePath('commands', c.id), maintainer: 'solanabr/ai-kit', official: false, desc: c.description, sha: null, model: c.model, tags: [], install: invokeLine('commands', c.id), def: true }));
  return packs.map(p => ({ id: p.id, title: p.name, href: pagePath('skills', p.id), maintainer: p.maintainer || '', official: p.official, desc: p.description, sha: shortSha(p.commit), model: null, tags: packTags(p), install: p.install, def: p.defaultInstalled }));
}

export function related(kind: Kind, id: string): Card[] {
  if (kind === 'skills') {
    const self = cards('skills').find(c => c.id === id)!;
    return cards('skills').filter(c => c.id !== id && c.tags.some(t => self.tags.includes(t))).slice(0, 3);
  }
  // Agents and commands: the ones this item hands off to or names.
  const ids = kind === 'agents' ? agent(id)!.handoffs.map(h => h.to) : command(id)!.commands;
  return cards(kind === 'agents' ? 'agents' : 'commands').filter(c => ids.includes(c.id)).slice(0, 3);
}

// --- Markdown twins ----------------------------------------------------------------------
const F = '```';
const yaml = (v: unknown) => {
  const s = String(v ?? '');
  return /^[\w./:@ -]*$/.test(s) && !/^\s|\s$|: /.test(s) ? s : JSON.stringify(s);
};
const front = (o: Record<string, unknown>) => ['---', ...Object.entries(o).map(([k, v]) => `${k}: ${yaml(v)}`), '---', ''];
const list = (xs: string[]) => (xs.length ? xs.map(x => '- ' + x) : ['- none']);

export function packMarkdown(p: Pack) {
  const url = pageUrl('skills', p.id);
  const s = safetyParts(p.safety);
  return [
    ...front({ id: p.id, name: p.name, type: 'skill-pack', maintainer: p.maintainer, official: p.official, license: p.license, source: p.source, commit: p.commit, install: p.install, url }),
    '# ' + p.name, '', p.description, '',
    '## Use it when', ...list(p.triggers), '',
    '## Install', 'Installed kit:', '', F + 'bash', p.install, F, '', `No install: fetch ${url}.md`, '',
    `## What's inside`, ...list(p.inside.map(x => `${x.id}: ${x.description || x.path}`)), '',
    '## Safety review', ...(s ? [`Reviewed at ${shortSha(p.commit)}. ${s.summary}`, '', ...s.full.map(x => '- ' + x)] : ['No review recorded.']), '',
    '## Used by', '- Agents: ' + (p.usedBy.agents.join(', ') || 'none'), '- Commands: ' + (p.usedBy.commands.map(c => '/' + c).join(', ') || 'none'),
    ''
  ].join('\n');
}

export function agentMarkdown(a: Agent) {
  const url = pageUrl('agents', a.id);
  return [
    ...front({ id: a.id, name: a.id, type: 'agent', model: a.model, license: 'MIT', source: fileUrl(a.file), invoke: `ask for the ${a.id} agent`, url }),
    '# ' + a.id, '', a.description, '',
    '## How to invoke', '', F, invokeLine('agents', a.id), F, '',
    '## What it does', ...list(a.does), '',
    '## Hands off to', ...list(a.handoffs.map(h => (h.when ? `${h.to}: ${h.when}` : h.to))), '',
    '## Uses', '- Skills: ' + (a.skills.join(', ') || 'none'), '- Commands: ' + (a.commands.map(c => '/' + c).join(', ') || 'none'),
    ''
  ].join('\n');
}

export function commandMarkdown(c: Command) {
  const url = pageUrl('commands', c.id);
  return [
    ...front({ id: c.id, name: '/' + c.id, type: 'command', model: c.model, license: 'MIT', source: fileUrl(c.file), invoke: '/' + c.id, url }),
    '# /' + c.id, '', c.description, '',
    '## How to invoke', '', F, '/' + c.id, F, '',
    '## What it does', ...list(c.does), '',
    '## Hands off to', ...list(c.agents), '',
    '## Uses', '- Skills: ' + (c.skills.join(', ') || 'none'), '- Commands: ' + (c.commands.map(x => '/' + x).join(', ') || 'none'),
    ''
  ].join('\n');
}

export function itemMarkdown(kind: Kind, id: string) {
  if (kind === 'skills') return packMarkdown(pack(id)!);
  if (kind === 'agents') return agentMarkdown(agent(id)!);
  return commandMarkdown(command(id)!);
}

const summary = `Claude Code, set up to ship on Solana. Open-source (MIT) agents, workflow commands and pinned skill packs from Superteam Brazil. Version ${kit.version}.`;

export function catalogMarkdown(kind: Kind) {
  const title = { skills: 'Skills', agents: 'Agents', commands: 'Commands' }[kind];
  const rows = kind === 'skills'
    ? packs.map(p => `- [${p.name}](${mdUrl('skills', p.id)}): ${p.description}`)
    : kind === 'agents'
      ? agents.map(a => `- [${a.id}](${mdUrl('agents', a.id)}): ${a.description}`)
      : commands.map(c => `- [/${c.id}](${mdUrl('commands', c.id)}): ${c.description}`);
  return [`# Solana AI Kit · ${title}`, '', `> ${summary}`, '', ...rows, ''].join('\n');
}

export function indexMarkdown(lang: Lang = 'en') {
  const br = lang === 'br';
  return [
    ...front({ name: 'Solana AI Kit', type: 'kit', version: kit.version, license: 'MIT', source: REPO, url: SITE + (br ? '/br' : '/') }),
    br ? '# Claude Code, configurado para entregar na Solana' : '# Claude Code, set up to ship on Solana', '',
    br
      ? 'Agentes, comandos de fluxo de trabalho e pacotes de skills fixados, em código aberto e vindos do próprio ecossistema Solana, para cada etapa: da validação da ideia até o lançamento.'
      : 'Open-source agents, workflow commands and pinned skill packs from the Solana ecosystem, for every step from validating the idea to launch.', '',
    br ? '## Instalação' : '## Install', '', F + 'bash', `curl -fsSL ${INSTALL_HOST} | bash`, F, '',
    br ? 'Para Codex, opencode e outros agentes:' : 'For Codex, opencode and other agents:', '', F + 'bash', `curl -fsSL ${INSTALL_HOST} | bash -s -- --agents`, F, '',
    br ? `Sem instalar: leia ${INSTALL_HOST}/CLAUDE-solana.md e siga as instruções na sessão.` : `No install: read ${INSTALL_HOST}/CLAUDE-solana.md and follow it for the session.`, '',
    br ? '## O que vem no kit' : `## What's inside`,
    `- ${counts.agents} ${br ? 'agentes especializados' : 'specialized agents'}: ${SITE}/agents.md`,
    `- ${counts.commands} ${br ? 'comandos de fluxo de trabalho' : 'workflow commands'}: ${SITE}/commands.md`,
    `- ${counts.packs} ${br ? 'pacotes de skills, cada um fixado em um commit' : 'skill packs, each pinned to a commit'} (${counts.defaultPacks} ${br ? 'instalados por padrão' : 'installed by default'}): ${SITE}/skills.md`,
    `- ${counts.mcp} ${br ? 'servidores MCP ativos por padrão' : 'MCP servers on by default'}: ${mcpList.map(m => m.name).join(', ')}`,
    `- ${br ? '4 níveis de firewall' : '4 firewall tiers'}: Off, Relaxed, Medium, High`, '',
    br ? `Índice completo para agentes: ${SITE}/llms.txt` : `Full index for agents: ${SITE}/llms.txt`, ''
  ].join('\n');
}

export function llmsTxt() {
  return [
    '# Solana AI Kit', '', `> ${summary}`, '',
    `Every page below is plain Markdown. Full text of all pages: ${SITE}/llms-full.txt`, '',
    `Install: curl -fsSL ${INSTALL_HOST} | bash`, '',
    '## Agents', ...agents.map(a => `- [${a.id}](${mdUrl('agents', a.id)}): ${a.description}`), '',
    '## Commands', ...commands.map(c => `- [/${c.id}](${mdUrl('commands', c.id)}): ${c.description}`), '',
    '## Skills', ...packs.map(p => `- [${p.name}](${mdUrl('skills', p.id)}): ${p.description}`), ''
  ].join('\n');
}

export function llmsFull() {
  const docs: [string, string][] = [
    [SITE + '/index.md', indexMarkdown('en')],
    ...agents.map(a => [mdUrl('agents', a.id), agentMarkdown(a)] as [string, string]),
    ...commands.map(c => [mdUrl('commands', c.id), commandMarkdown(c)] as [string, string]),
    ...packs.map(p => [mdUrl('skills', p.id), packMarkdown(p)] as [string, string])
  ];
  return docs.map(([u, md]) => `<!-- ${u} -->\n${md}`).join('\n');
}

export const markdownResponse = (body: string, type = 'text/markdown') =>
  new Response(body, { headers: { 'content-type': `${type}; charset=utf-8` } });
