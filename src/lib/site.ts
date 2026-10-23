// Site-level constants and the few hand-maintained tables. Everything about
// agents, commands and packs comes from src/data/kit.json (npm run sync).
import kitData from '../data/kit.json';

export const SITE = (import.meta.env.SITE as string | undefined)?.replace(/\/$/, '') || 'https://ai.superteam.codes';
export const REPO = 'https://github.com/solanabr/ai-kit';
export const ORG = 'https://github.com/solanabr';
export const INSTALL_HOST = 'https://aikit.superteam.codes';

export type Lang = 'en' | 'br';
export type Kind = 'skills' | 'agents' | 'commands';

// Locales in their own language. Only those with `live: true` are built and
// emitted as hreflang alternates; the rest are listed as planned.
export const LOCALES = [
  { code: 'en', path: '/', label: 'English', hreflang: 'en', live: true },
  { code: 'br', path: '/br', label: 'Português (Brasil)', hreflang: 'pt-BR', live: true },
  { code: 'es', path: '/es', label: 'Español', hreflang: 'es', live: false },
  { code: 'zh', path: '/zh', label: '中文', hreflang: 'zh-Hans', live: false },
  { code: 'ja', path: '/ja', label: '日本語', hreflang: 'ja', live: false },
  { code: 'ko', path: '/ko', label: '한국어', hreflang: 'ko', live: false },
  { code: 'tr', path: '/tr', label: 'Türkçe', hreflang: 'tr', live: false },
  { code: 'vi', path: '/vi', label: 'Tiếng Việt', hreflang: 'vi', live: false }
] as const;

export const MCP_ROLES: Record<string, { name: string; en: string; br: string }> = {
  helius: { name: 'Helius', en: 'on-chain data', br: 'dados on-chain' },
  'solana-dev': { name: 'solana-dev', en: 'Solana docs', br: 'documentação Solana' },
  context7: { name: 'Context7', en: 'library docs', br: 'documentação de bibliotecas' },
  'context-mode': { name: 'context-mode', en: 'context compression', br: 'compressão de contexto' }
};

// Display names that replace a pack's registry name on the site (card, page,
// Markdown twin, llms.txt). The pack id and the registry stay unchanged.
export const PACK_NAMES: Record<string, string> = {
  'get-shit-pretty': 'GSP'
};

// Catalog filter chips, each matched against a pack's registry tags.
export const TAGS: { label: string; match: string[] }[] = [
  { label: 'DeFi', match: ['defi', 'swap', 'clmm', 'liquidity', 'dlmm', 'trading', 'stablecoin', 'payments'] },
  { label: 'NFT', match: ['nft', 'cnft'] },
  { label: 'testing', match: ['testing', 'fuzzing', 'e2e', 'qa', 'formal-verification'] },
  { label: 'security', match: ['security', 'audit', 'transaction-review', 'signing'] },
  { label: 'mobile', match: ['mobile', 'react-native'] },
  { label: 'gaming', match: ['gaming', 'unity'] },
  { label: 'infra', match: ['infra', 'rpc', 'devops', 'iac', 'workers', 'edge', 'deploy', 'cache', 'gcp'] },
  { label: 'data', match: ['data', 'sql', 'analytics', 'database', 'postgres'] },
  { label: 'go-to-market', match: ['go-to-market', 'marketing', 'seo', 'content', 'hackathon'] }
];

// Display names for the ecosystem chips, in the order they appear. A chip is
// shown only when the registry pins a pack from that maintainer.
export const ECOSYSTEM: { maintainer: string; name: string; pack: string }[] = [
  { maintainer: 'solana-foundation', name: 'Solana Foundation', pack: 'solana-dev' },
  { maintainer: 'jup-ag', name: 'Jupiter', pack: 'jupiter' },
  { maintainer: 'ColosseumOrg', name: 'Colosseum', pack: 'colosseum' },
  { maintainer: 'metaplex-foundation', name: 'Metaplex', pack: 'metaplex' },
  { maintainer: 'magicblock-labs', name: 'MagicBlock', pack: 'magicblock' },
  { maintainer: 'helius-labs', name: 'Helius', pack: 'helius' },
  { maintainer: 'alchemyplatform', name: 'Alchemy', pack: 'alchemy' },
  { maintainer: 'sendaifun', name: 'SendAI', pack: 'sendai' },
  { maintainer: 'solana-mobile', name: 'Solana Mobile', pack: 'solana-mobile' },
  { maintainer: 'Lightprotocol', name: 'Light Protocol', pack: 'light-protocol' },
  { maintainer: 'circlefin', name: 'Circle', pack: 'circle' },
  { maintainer: 'duneanalytics', name: 'Dune', pack: 'dune' }
];

// "Start with your task". Every id is checked against kit.json at build
// (src/lib/data.ts throws on a stale one).
export const TASKS = [
  { id: 'anchor', label: { en: 'Write an Anchor program', br: 'Escrever um programa Anchor' }, agent: 'anchor-engineer', command: 'build-program', packs: ['solana-dev'], prompt: { en: 'Use the anchor-engineer agent to write an escrow with a 48-hour expiry', br: 'Use o agente anchor-engineer para escrever um escrow com expiração de 48 horas' } },
  { id: 'jupiter', label: { en: 'Integrate Jupiter', br: 'Integrar a Jupiter' }, agent: 'defi-engineer', command: 'plan-feature', packs: ['jupiter', 'solana-dev'], prompt: { en: '/plan-feature swap any token to USDC at checkout', br: '/plan-feature trocar qualquer token por USDC no checkout' } },
  { id: 'token', label: { en: 'Launch a token', br: 'Lançar um token' }, agent: 'token-engineer', command: 'plan-feature', packs: ['solana-dev', 'metaplex'], prompt: { en: 'Use the token-engineer agent to create a Token-2022 mint with metadata', br: 'Use o agente token-engineer para criar um mint Token-2022 com metadados' } },
  { id: 'mobile', label: { en: 'Build a mobile dApp', br: 'Criar um dApp mobile' }, agent: 'mobile-engineer', command: 'plan-feature', packs: ['solana-mobile', 'solana-dev'], prompt: { en: '/plan-feature Android sign-in with Mobile Wallet Adapter', br: '/plan-feature login no Android com Mobile Wallet Adapter' } },
  { id: 'audit', label: { en: 'Audit before mainnet', br: 'Auditar antes da mainnet' }, agent: 'solana-qa-engineer', command: 'audit-solana', packs: ['auditor-skill', 'solana-dev'], prompt: { en: '/audit-solana programs/vault', br: '/audit-solana programs/vault' } },
  { id: 'hackathon', label: { en: 'Ship a hackathon project', br: 'Entregar um projeto de hackathon' }, agent: 'solana-architect', command: 'plan-feature', packs: ['colosseum', 'solana-dev'], prompt: { en: '/plan-feature hackathon MVP: idea check, program, demo app', br: '/plan-feature MVP de hackathon: validar a ideia, programa, app de demo' } }
];

// Firewall tier behaviour. The kit has no machine-readable tier matrix, so
// this is transcribed from its README "Firewall tiers" table and
// docs/firewall.md's gate table, at the rule set named by ruleSetVersion.
// The build fails when the kit's RULE_SET_VERSION moves past it (data.ts),
// so a firewall change cannot publish a stale table: re-check both docs,
// update the rows, then bump ruleSetVersion.
export type Gate = 'open' | 'ask' | 'block';
export const TIERS = {
  ruleSetVersion: 6,
  cols: ['Off', 'Relaxed', 'Medium', 'High'],
  values: { open: { en: 'not gated', br: 'livre' }, ask: { en: 'asks', br: 'pergunta' }, block: { en: 'blocks', br: 'bloqueia' } } as Record<Gate, { en: string; br: string }>,
  rows: [
    { label: { en: 'Mainnet deploys and authority changes', br: 'Deploys na mainnet e troca de autoridade' }, v: ['ask', 'ask', 'ask', 'block'] as Gate[] },
    { label: { en: 'Wallet keypair and credential reads', br: 'Leitura de keypairs da carteira e credenciais' }, v: ['block', 'block', 'block', 'block'] as Gate[] },
    { label: { en: 'Irreversible on-chain actions', br: 'Ações on-chain irreversíveis' }, v: ['block', 'block', 'block', 'block'] as Gate[] },
    { label: { en: 'Destructive shell commands', br: 'Comandos de shell destrutivos' }, v: ['block', 'block', 'block', 'block'] as Gate[] },
    { label: { en: 'Package publishing', br: 'Publicação de pacotes' }, v: ['open', 'ask', 'block', 'block'] as Gate[] },
    { label: { en: 'Force push and PR merge', br: 'Force push e merge de PR' }, v: ['open', 'open', 'ask', 'block'] as Gate[] }
  ]
};

export const KIT_VERSION: string = kitData.version;
