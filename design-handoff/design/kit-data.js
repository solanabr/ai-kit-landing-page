// Mock of the build-time data layer. In production every value here is read from
// skill-registry.json, the agents/ and commands/ folders, and the GitHub API.
// sample:true marks entries/fields that are NOT from the real registry.
export const SITE = 'https://aikit.superteam.codes';
export const REPO = 'https://github.com/solanabr/ai-kit';

export const KIT = {
  version: '2.4.0', license: 'MIT',
  counts: { agents: 15, commands: 34, packs: 46, defaultPacks: 4, mcp: 4, firewallTiers: 4 },
  stars: null,        // GitHub stars, fetched at build. null = placeholder
  maintainers: null   // distinct registry maintainers, computed at build. null = placeholder
};

export const LOCALES = [
  { code: 'en', path: '/', label: 'English', hreflang: 'en', href: 'Home.dc.html' },
  { code: 'br', path: '/br', label: 'Português (Brasil)', hreflang: 'pt-BR', href: 'Home pt-BR.dc.html' },
  { code: 'es', path: '/es', label: 'Español', hreflang: 'es', href: null },
  { code: 'zh', path: '/zh', label: '中文', hreflang: 'zh-Hans', href: null },
  { code: 'ja', path: '/ja', label: '日本語', hreflang: 'ja', href: null },
  { code: 'ko', path: '/ko', label: '한국어', hreflang: 'ko', href: null },
  { code: 'tr', path: '/tr', label: 'Türkçe', hreflang: 'tr', href: null },
  { code: 'vi', path: '/vi', label: 'Tiếng Việt', hreflang: 'vi', href: null }
];

export const MCP = [
  { name: 'Helius', role: { en: 'on-chain data', br: 'dados on-chain' } },
  { name: 'solana-dev', role: { en: 'Solana docs', br: 'documentação Solana' } },
  { name: 'Context7', role: { en: 'library docs', br: 'documentação de bibliotecas' } },
  { name: 'context-mode', role: { en: 'context compression', br: 'compressão de contexto' } }
];

export const TAGS = ['DeFi', 'NFT', 'testing', 'security', 'mobile', 'gaming', 'infra', 'data', 'go-to-market'];

const A = (id, desc, tags, model, handsOff) => ({ id, desc, tags, model, handsOff, sample: true });
export const AGENTS = [
  A('solana-architect', 'Designs accounts, PDAs and program boundaries before code is written.', ['infra'], 'opus', ['anchor-engineer', 'pinocchio-engineer', 'solana-frontend-engineer']),
  Object.assign(A('anchor-engineer', 'Writes, tests and upgrades Anchor programs.', ['infra', 'testing'], 'sonnet', ['solana-qa-engineer', 'solana-frontend-engineer', 'tech-docs-writer']), {
    does: ['Implements instructions, accounts and constraints from a plan or a spec.', 'Writes LiteSVM and Mollusk tests next to each instruction.', 'Generates the IDL and keeps the TypeScript client in step.', 'Checks compute usage with /profile-cu before handing off.'],
    triggers: ['Anchor program', 'new instruction', 'account constraints', 'IDL changes'],
    skills: ['solana-dev'], commands: ['build-program', 'test-rust', 'profile-cu', 'generate-idl-client']
  }),
  A('pinocchio-engineer', 'Builds compute-lean programs with Pinocchio.', ['infra'], 'sonnet', ['solana-qa-engineer']),
  A('defi-engineer', 'Integrates swaps, lending, perps and oracles.', ['DeFi'], 'sonnet', ['solana-qa-engineer', 'solana-frontend-engineer']),
  A('token-engineer', 'Creates and manages SPL and Token-2022 mints.', ['DeFi', 'go-to-market'], 'sonnet', ['devops-engineer']),
  A('solana-frontend-engineer', 'Builds web dApps on @solana/kit with wallet connection.', ['infra'], 'sonnet', ['solana-qa-engineer']),
  A('mobile-engineer', 'Builds Android dApps with Solana Mobile tooling.', ['mobile'], 'sonnet', ['solana-qa-engineer']),
  A('rust-backend-engineer', 'Writes indexers, services and RPC backends in Rust.', ['infra', 'data'], 'sonnet', ['devops-engineer']),
  A('devops-engineer', 'Handles verifiable builds, deploys and program upgrades.', ['infra'], 'sonnet', ['solana-qa-engineer']),
  A('solana-qa-engineer', 'Tests and reviews programs before they reach mainnet.', ['testing', 'security'], 'opus', ['anchor-engineer', 'devops-engineer']),
  A('tech-docs-writer', 'Writes READMEs, integration guides and IDL docs.', ['go-to-market'], 'sonnet', []),
  A('game-architect', 'Designs on-chain game state and turn loops.', ['gaming'], 'opus', ['unity-engineer', 'anchor-engineer']),
  A('unity-engineer', 'Builds Unity clients that talk to Solana programs.', ['gaming'], 'sonnet', ['solana-qa-engineer']),
  A('solana-guide', 'Explains Solana concepts while you build.', [], 'inherit', ['solana-architect']),
  A('solana-researcher', 'Researches protocols, docs and on-chain data.', ['data'], 'opus', ['solana-architect'])
];

const C = (id, desc, agent, tags, args) => ({ id, desc, agent, tags, args: args || '', model: 'inherit', sample: true });
export const COMMANDS = [
  C('plan-feature', 'Turns a feature request into a reviewed plan with accounts, instructions and tests.', 'solana-architect', ['infra'], '<feature>'),
  C('build-program', 'Implements a planned program or instruction.', 'anchor-engineer', ['infra'], '<spec>'),
  C('test-rust', 'Runs and extends the Rust test suite.', 'solana-qa-engineer', ['testing']),
  Object.assign(C('audit-solana', 'Reviews a program for Solana-specific security issues and writes a report.', 'solana-qa-engineer', ['security', 'testing'], '[path]'), {
    does: ['Reads the program and its tests, then checks signer, owner and PDA constraints.', 'Looks for unchecked arithmetic, missing close constraints and CPI pitfalls.', 'Writes findings by severity, each with file and line, to audits/.', 'Suggests fixes and hands them to the program\'s engineer agent.'],
    triggers: ['security review', 'before mainnet', 'audit'], skills: ['solana-dev'], handsOff: ['anchor-engineer', 'pinocchio-engineer']
  }),
  C('diff-review', 'Reviews the current diff against the plan and conventions.', 'solana-qa-engineer', ['testing']),
  C('profile-cu', 'Measures compute units per instruction.', 'anchor-engineer', ['infra', 'testing']),
  C('deploy', 'Builds verifiably and deploys to a cluster, behind the firewall.', 'devops-engineer', ['infra'], '--cluster <name>'),
  C('debug-user-tx', 'Explains why a user\'s transaction failed.', 'solana-researcher', ['data'], '<signature>'),
  C('inspect-mint', 'Reads a mint\'s authorities, extensions and supply.', 'token-engineer', ['DeFi', 'data'], '<mint>'),
  C('migrate-web3', 'Migrates @solana/web3.js code to @solana/kit.', 'solana-frontend-engineer', ['infra']),
  C('generate-idl-client', 'Generates a typed client from a program IDL.', 'solana-frontend-engineer', ['infra']),
  C('firewall', 'Shows or changes the firewall tier.', 'devops-engineer', ['security'], '[off|relaxed|medium|high]'),
  C('doctor', 'Checks toolchain versions and kit configuration.', 'devops-engineer', ['infra'])
];

export const PACKS = [
  {
    id: 'solana-dev', name: 'Solana Dev Skill', maintainer: 'solana-foundation', official: true, license: 'MIT',
    description: 'Solana Foundation development skill: Anchor 1.x and Pinocchio programs, @solana/kit clients, LiteSVM, Mollusk and Surfpool testing, security, Token-2022, payments.',
    triggers: ['Solana programs', 'Anchor', 'Pinocchio', '@solana/kit', 'program tests', 'security review'],
    tags: ['infra', 'testing', 'security'], tier: 'core', default_installed: true,
    source: 'https://github.com/solana-foundation/solana-dev-skill', commit: '674da5a', commit_full: null,
    signal: { stars: 559, last_commit: '2026-09-21' }, pinned_at: null,
    install: { command: 'bash .claude/bin/skills.sh add solana-dev' },
    inside: [
      { id: 'anchor', desc: 'Anchor 1.x programs: accounts, constraints, CPIs, IDL.' },
      { id: 'pinocchio', desc: 'Pinocchio programs with zero-copy accounts.' },
      { id: 'kit-clients', desc: '@solana/kit clients and transaction building.' },
      { id: 'testing', desc: 'LiteSVM, Mollusk and Surfpool test setups.' },
      { id: 'security', desc: 'Program security review checklist.' },
      { id: 'token-2022', desc: 'Token-2022 mints and extensions.' },
      { id: 'payments', desc: 'Payment flows on Solana.' }
    ], insideSample: true,
    safety: { summary: 'Scanned at 674da5a: documentation and code samples only; no shell execution or network calls in the skill files.', full: ['The scan covered every file in the pack at the pinned commit.', 'No skill instructs the agent to read keypairs, wallets or environment secrets.', 'Code samples that deploy programs target localnet or devnet.'], sample: true },
    usedBy: { agents: ['solana-architect', 'anchor-engineer', 'pinocchio-engineer', 'solana-qa-engineer'], commands: ['plan-feature', 'build-program', 'audit-solana', 'deploy'] }
  },
  {
    id: 'jupiter', name: 'Jupiter Agent Skills', maintainer: 'jup-ag', official: true, license: 'MIT',
    description: 'Jupiter\'s official skills: integrating-jupiter (swap, lend, perps, trigger, recurring), jupiter-lend, jupiter-swap-migration, jupiter-vrfd.',
    triggers: ['Jupiter', 'token swaps', 'Jupiter Lend', 'perps', 'trigger orders', 'recurring orders'],
    tags: ['DeFi'], tier: 'extension', default_installed: false,
    source: 'https://github.com/jup-ag/agent-skills', commit: 'a2211e3', commit_full: 'a2211e3f6a7caa03310c7a9a8d816e723b0bdc5f',
    signal: { stars: 84, last_commit: '2026-07-07' }, pinned_at: null,
    install: { command: 'bash .claude/bin/skills.sh add jupiter' },
    inside: [
      { id: 'integrating-jupiter', desc: 'Swap, lend, perps, trigger and recurring orders.' },
      { id: 'jupiter-lend', desc: 'Jupiter Lend.' },
      { id: 'jupiter-swap-migration', desc: 'Migrating an existing swap integration.' },
      { id: 'jupiter-vrfd', desc: 'Read from the skill\'s SKILL.md at build.' }
    ],
    safety: { summary: 'Scanned at a2211e3: no shell execution, no network calls outside Jupiter\'s documented API hosts, and no instructions to read keypairs or secrets.', full: ['The scan covered all four skills and their reference files at the pinned commit.', 'Network access in code samples is limited to Jupiter API hosts named in the skill text.', 'Swap examples build transactions for the user to sign; none sign with a local keypair.', 'No obfuscated content, encoded payloads or instructions that ask the agent to change its own configuration were found.'], sample: true },
    usedBy: { agents: ['defi-engineer'], commands: ['plan-feature'] }
  }
];
const S = (id, maintainer, desc, tags) => ({
  id, name: maintainer.name + ' skills', maintainer: maintainer.handle, official: true, license: null, description: desc,
  triggers: [], tags, tier: 'extension', default_installed: false, source: null, commit: null, commit_full: null,
  signal: { stars: null, last_commit: null }, pinned_at: null, install: { command: 'bash .claude/bin/skills.sh add ' + id },
  inside: [], safety: null, usedBy: { agents: [], commands: [] }, sample: true
});
PACKS.push(
  S('metaplex', { name: 'Metaplex', handle: 'metaplex-foundation' }, 'NFTs and digital assets on Metaplex Core and Token Metadata.', ['NFT']),
  S('magicblock', { name: 'MagicBlock', handle: 'magicblock-labs' }, 'Ephemeral rollups for real-time and game state.', ['gaming', 'infra']),
  S('helius', { name: 'Helius', handle: 'helius-labs' }, 'RPC, webhooks and enhanced transaction data.', ['data', 'infra']),
  S('colosseum', { name: 'Colosseum', handle: 'ColosseumOrg' }, 'Hackathon idea validation and submission prep.', ['go-to-market']),
  S('alchemy', { name: 'Alchemy', handle: 'alchemyplatform' }, 'Solana RPC and data APIs on Alchemy.', ['infra', 'data']),
  S('sendai', { name: 'SendAI', handle: 'sendaifun' }, 'Agent-driven Solana actions and integrations.', ['DeFi', 'infra']),
  S('solana-mobile', { name: 'Solana Mobile', handle: 'solana-mobile' }, 'Mobile Wallet Adapter and Android dApp setup.', ['mobile']),
  S('light-protocol', { name: 'Light Protocol', handle: 'Lightprotocol' }, 'ZK compression for accounts and tokens.', ['infra']),
  S('circle', { name: 'Circle', handle: 'circlefin' }, 'USDC payments and transfers.', ['DeFi']),
  S('dune', { name: 'Dune', handle: 'duneanalytics' }, 'Querying Solana data on Dune.', ['data'])
);

export const MAINTAINERS = [
  ['Solana Foundation', 'solana-dev'], ['Jupiter', 'jupiter'], ['Colosseum', 'colosseum'], ['Metaplex', 'metaplex'],
  ['MagicBlock', 'magicblock'], ['Helius', 'helius'], ['Alchemy', 'alchemy'], ['SendAI', 'sendai'],
  ['Solana Mobile', 'solana-mobile'], ['Light Protocol', 'light-protocol'], ['Circle', 'circle'], ['Dune', 'dune']
].map(([name, pack]) => ({ name, pack, logoPermitted: false }));

export const TASKS = [
  { id: 'anchor', label: { en: 'Write an Anchor program', br: 'Escrever um programa Anchor' }, agent: 'anchor-engineer', command: 'build-program', packs: ['solana-dev'], prompt: { en: '/build-program escrow with a 48-hour expiry', br: '/build-program escrow com expiração de 48 horas' } },
  { id: 'jupiter', label: { en: 'Integrate Jupiter', br: 'Integrar a Jupiter' }, agent: 'defi-engineer', command: 'plan-feature', packs: ['jupiter', 'solana-dev'], prompt: { en: '/plan-feature swap any token to USDC at checkout', br: '/plan-feature trocar qualquer token por USDC no checkout' } },
  { id: 'token', label: { en: 'Launch a token', br: 'Lançar um token' }, agent: 'token-engineer', command: 'inspect-mint', packs: ['solana-dev', 'metaplex'], prompt: { en: 'Use the token-engineer agent to create a Token-2022 mint with metadata', br: 'Use o agente token-engineer para criar um mint Token-2022 com metadados' } },
  { id: 'mobile', label: { en: 'Build a mobile dApp', br: 'Criar um dApp mobile' }, agent: 'mobile-engineer', command: 'plan-feature', packs: ['solana-mobile', 'solana-dev'], prompt: { en: '/plan-feature Android sign-in with Mobile Wallet Adapter', br: '/plan-feature login no Android com Mobile Wallet Adapter' } },
  { id: 'audit', label: { en: 'Audit before mainnet', br: 'Auditar antes da mainnet' }, agent: 'solana-qa-engineer', command: 'audit-solana', packs: ['solana-dev'], prompt: { en: '/audit-solana programs/vault', br: '/audit-solana programs/vault' } },
  { id: 'hackathon', label: { en: 'Ship a hackathon project', br: 'Entregar um projeto de hackathon' }, agent: 'solana-architect', command: 'plan-feature', packs: ['colosseum', 'solana-dev'], prompt: { en: '/plan-feature hackathon MVP: idea check, program, demo app', br: '/plan-feature MVP de hackathon: validar a ideia, programa, app de demo' } }
];

// Draft: tier behaviour is generated from the firewall config at build.
export const TIERS = {
  cols: ['Off', 'Relaxed', 'Medium', 'High'],
  values: { open: { en: 'not gated', br: 'livre' }, ask: { en: 'asks', br: 'pergunta' }, block: { en: 'blocks', br: 'bloqueia' } },
  rows: [
    { label: { en: 'Mainnet deploys', br: 'Deploys na mainnet' }, v: ['open', 'ask', 'ask', 'ask'] },
    { label: { en: 'Secret and keypair reads', br: 'Leitura de segredos e keypairs' }, v: ['open', 'ask', 'ask', 'block'] },
    { label: { en: 'Destructive commands', br: 'Comandos destrutivos' }, v: ['open', 'open', 'ask', 'block'] }
  ]
};

// ——— lookups ———
export const pack = id => PACKS.find(p => p.id === id);
export const agent = id => AGENTS.find(a => a.id === id);
export const command = id => COMMANDS.find(c => c.id === id);
export const pathOf = (kind, id, lang) => (lang === 'br' ? '/br' : '') + '/' + kind + '/' + id;
export const mdUrl = (kind, id, lang) => SITE + pathOf(kind, id, lang) + '.md';
export const pageHref = (kind, id) => 'Detail.dc.html?kind=' + kind + '&id=' + encodeURIComponent(id);

export function cards(kind) {
  if (kind === 'agents') return AGENTS.map(a => ({ id: a.id, title: a.id, href: pageHref('agents', a.id), maintainer: 'solanabr/ai-kit', official: false, desc: a.desc, sha: null, model: a.model, tags: a.tags, install: 'Use the ' + a.id + ' agent to …', def: true, sample: a.sample, path: '/agents/' + a.id }));
  if (kind === 'commands') return COMMANDS.map(c => ({ id: c.id, title: '/' + c.id, href: pageHref('commands', c.id), maintainer: 'solanabr/ai-kit', official: false, desc: c.desc, sha: null, model: c.model, tags: c.tags, install: '/' + c.id + (c.args ? ' ' + c.args : ''), def: true, sample: c.sample, path: '/commands/' + c.id }));
  return PACKS.map(p => ({ id: p.id, title: p.name, href: pageHref('skills', p.id), maintainer: p.maintainer, official: p.official, desc: p.description, sha: p.commit, model: null, tags: p.tags, install: p.install.command, def: p.default_installed, sample: !!p.sample, path: '/skills/' + p.id }));
}

// ——— Markdown twins: generated from the same objects the HTML pages render ———
const F = '```';
export function toMarkdown(kind, id, lang) {
  const url = SITE + pathOf(kind, id, lang);
  if (kind === 'skills') {
    const p = pack(id);
    return [
      '---', 'id: ' + p.id, 'name: ' + p.name, 'type: skill-pack', 'maintainer: ' + p.maintainer, 'official: ' + p.official,
      'license: ' + (p.license || ''), 'source: ' + (p.source || ''), 'commit: ' + (p.commit_full || p.commit || ''),
      'install: ' + p.install.command, 'url: ' + url, '---', '',
      '# ' + p.name, '', p.description, '',
      '## Use it when', ...p.triggers.map(t => '- ' + t), '',
      '## Install', 'Installed kit:', '', F + 'bash', p.install.command, F, '', 'No install: fetch ' + url + '.md', '',
      '## What\'s inside', ...p.inside.map(s => '- ' + s.id + ': ' + s.desc), '',
      '## Safety review', p.safety ? p.safety.summary : '', ...(p.safety ? ['', ...p.safety.full.map(x => '- ' + x)] : []), '',
      '## Used by', '- Agents: ' + p.usedBy.agents.join(', '), '- Commands: ' + p.usedBy.commands.map(c => '/' + c).join(', ')
    ].join('\n');
  }
  if (kind === 'agents') {
    const a = agent(id);
    return [
      '---', 'id: ' + a.id, 'name: ' + a.id, 'type: agent', 'model: ' + a.model, 'license: MIT',
      'source: ' + REPO + '/blob/main/.claude/agents/' + a.id + '.md', 'invoke: ask for the ' + a.id + ' agent', 'url: ' + url, '---', '',
      '# ' + a.id, '', a.desc, '',
      '## Use it when', ...(a.triggers || []).map(t => '- ' + t), '',
      '## How to invoke', '', F, 'Use the ' + a.id + ' agent to …', F, '',
      '## What it does', ...(a.does || []).map(x => '- ' + x), '',
      '## Hands off to', ...a.handsOff.map(h => '- ' + h), '',
      '## Uses', '- Skills: ' + (a.skills || []).join(', '), '- Commands: ' + (a.commands || []).map(c => '/' + c).join(', ')
    ].join('\n');
  }
  const c = command(id);
  return [
    '---', 'id: ' + c.id, 'name: /' + c.id, 'type: command', 'model: ' + c.model, 'license: MIT',
    'source: ' + REPO + '/blob/main/.claude/commands/' + c.id + '.md', 'invoke: /' + c.id + (c.args ? ' ' + c.args : ''), 'url: ' + url, '---', '',
    '# /' + c.id, '', c.desc, '',
    '## Use it when', ...(c.triggers || []).map(t => '- ' + t), '',
    '## How to invoke', '', F, '/' + c.id + (c.args ? ' ' + c.args : ''), F, '',
    '## What it does', ...(c.does || []).map(x => '- ' + x), '',
    '## Routes to', '- ' + c.agent, ...(c.handsOff ? ['', '## Hands off to', ...c.handsOff.map(h => '- ' + h)] : []), '',
    '## Uses', '- Skills: ' + (c.skills || []).join(', ')
  ].join('\n');
}

export function llmsTxt() {
  return [
    '# Solana AI Kit', '',
    '> Claude Code, set up to ship on Solana. Open-source (MIT) agents, workflow commands and pinned skill packs from Superteam Brazil. Version ' + KIT.version + '.', '',
    'Every page below is plain Markdown. Full text of all pages: ' + SITE + '/llms-full.txt', '',
    '## Agents', ...AGENTS.map(a => '- [' + a.id + '](' + mdUrl('agents', a.id) + '): ' + a.desc), '',
    '## Commands', ...COMMANDS.map(c => '- [/' + c.id + '](' + mdUrl('commands', c.id) + '): ' + c.desc), '',
    '## Skills', ...PACKS.map(p => '- [' + p.name + '](' + mdUrl('skills', p.id) + '): ' + p.description)
  ].join('\n');
}

export function llmsFull() {
  const docs = [['skills', 'solana-dev'], ['skills', 'jupiter'], ['agents', 'anchor-engineer'], ['commands', 'audit-solana']];
  return docs.map(([k, id]) => '<!-- ' + mdUrl(k, id) + ' -->\n' + toMarkdown(k, id)).join('\n\n');
}
