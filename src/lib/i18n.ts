import { INSTALL_HOST, type Lang } from './site';

// UI strings. Commands, code, file paths, agent and command ids and tier names
// stay in English in every locale.
export const UI = {
  en: {
    nav: { skills: 'Skills', agents: 'Agents', commands: 'Commands', docs: 'Docs' },
    theme: 'Toggle theme', menu: 'Menu', language: 'Language', languages: 'Languages', planned: 'planned',
    copy: 'Copy', copied: 'Copied', installMethod: 'Install method',
    starsTitle: 'GitHub stars, read from the GitHub API at build',
    md: { group: 'Markdown version', copy: 'Copy as Markdown', view: 'View .md', claude: 'Open in Claude', gpt: 'Open in ChatGPT', prompt: (u: string) => `Read ${u} and use it for this session` },
    footer: { tagline: 'Claude Code, set up to ship on Solana.', kit: 'Kit', project: 'Project', agents: 'For agents', licence: 'MIT licence', builtBy: 'Built by Superteam Brazil' },
    official: 'Official', facts: 'Facts'
  },
  br: {
    nav: { skills: 'Skills', agents: 'Agentes', commands: 'Comandos', docs: 'Docs' },
    theme: 'Alternar tema', menu: 'Menu', language: 'Idioma', languages: 'Idiomas', planned: 'em breve',
    copy: 'Copiar', copied: 'Copiado', installMethod: 'Forma de instalação',
    starsTitle: 'Estrelas no GitHub, lidas da API do GitHub no build',
    md: { group: 'Versão em Markdown', copy: 'Copiar como Markdown', view: 'Ver .md', claude: 'Abrir no Claude', gpt: 'Abrir no ChatGPT', prompt: (u: string) => `Leia ${u} e use nesta sessão` },
    footer: { tagline: 'Claude Code, configurado para entregar na Solana.', kit: 'Kit', project: 'Projeto', agents: 'Para agentes', licence: 'Licença MIT', builtBy: 'Feito pela Superteam Brasil' },
    official: 'Oficial', facts: 'Fatos'
  }
} satisfies Record<Lang, unknown>;

const code = (s: string) => `<code>${s}</code>`;

export const HOME = {
  en: {
    title: 'Solana AI Kit · Claude Code, set up to ship on Solana',
    description: 'Open-source agents, workflow commands and pinned skill packs that set up Claude Code, Codex and opencode to build on Solana.',
    kicker: (v: string) => `v${v} · MIT · open source · Superteam Brazil`,
    h1: 'Claude Code, set up to ship on Solana.',
    sub: 'Open-source agents, workflow commands and pinned skill packs from the Solana ecosystem, for every step from validating the idea to launch.',
    tabs: ['curl', 'verify first', 'codex / opencode', 'no install'],
    capVerify: 'Download, read, then run.', capAgents: 'Adds configuration for Codex, opencode and other agents.', capNone: 'Paste this into any agent. Nothing is written to your project.',
    nonePrompt: `Read ${INSTALL_HOST}/CLAUDE-solana.md and follow it for this session. We are building on Solana.`,
    note: "Run it from your project's root.", github: 'View on GitHub', noAccount: 'No account, no sign-up.',
    insideH: "What's inside",
    agents: ' specialized agents', commands: ' workflow commands', packs: ' skill packs, each pinned to a commit and scanned before it ships',
    packsDetail: (n: number, names: string) => `${n} installed by default, the rest added on demand. From ${names} and more.`,
    mcp: ' MCP servers on by default', fw: ' firewall tiers: Off, Relaxed, Medium, High', fwDetail: 'Gates mainnet deploys, secret and keypair reads, and destructive commands.',
    prog: 'Progressive loading', progDetail: "Almost none of it enters the model's context until a task needs it.",
    figH: 'Figures',
    figStars: 'GitHub stars', figPacks: 'skill packs', figMaint: 'ecosystem maintainers', figVer: 'current version',
    srcStars: (d: string) => `GitHub API, read ${d}`, srcPacks: 'skill-registry.json', srcMaint: 'distinct maintainers in the registry', srcVer: 'latest kit tag', placeholder: 'placeholder',
    taskH: 'Start with your task', taskIntro: 'Pick what you are building. Each task points to the agent, command and packs that fit it.', tasksAria: 'Tasks',
    agent: 'Agent', command: 'Command', packsLabel: 'Packs', tryLabel: 'Try',
    safeH: 'Built for mainnet safety',
    safeIntro: `The firewall decides what an agent may do without asking you. Change the tier with ${code('/firewall')}.`,
    action: 'Action', tierSrc: (v: string) => `As of kit v${v} · from the kit's firewall documentation`,
    pinned: ['Pinned and scanned.', 'Every skill pack is pinned to a commit and scanned before it ships, so a pack changes only when a kit release moves its pin.'],
    keypair: ['Keypair protection.', `Reads of private keys, wallet vaults and credentials are blocked at every tier, Off included. The agent uses ${code('solana address')} for the public key and asks you to run anything that needs the secret.`],
    ecoH: 'Skills from the ecosystem', ecoIntro: "Packs come from the protocols' own repositories.", allPacks: (n: number) => `All ${n} skill packs`,
    faqH: 'FAQ',
    faq: [
      ['Does it work outside Claude Code?', `Yes. Claude Code is the primary target. The ${code('--agents')} flag installs it for Codex, opencode and other agents, and no-install mode works in any agent that can fetch a URL.`],
      ['What does it install, and where?', `Everything goes into the project you run it from: agents, commands, skills and a ${code('settings.json')} with the permissions, sandbox and firewall hooks under ${code('.claude/')}, plus ${code('CLAUDE.md')}, ${code('.mcp.json')} and ${code('.env')}. DEFAULTS skill packs are installed by default; add others with ${code('bash .claude/bin/skills.sh add &lt;id&gt;')}.`],
      ['Does it send my code anywhere?', 'The kit is configuration files in your repository. It has no account and no server of its own. Your agent still talks to its model provider, and each MCP server receives only the requests your agent sends to it. You can turn any MCP server off.'],
      ['How do updates work?', `Run ${code('/update')} inside Claude Code, or ${code('bash .claude/bin/update.sh')}. Skill packs are pinned to commits, so a pack only changes when a new kit release moves its pin after a fresh scan.`],
      ['What is "no install" mode?', `A short prompt you paste into any agent. It points the agent at ${code('aikit.superteam.codes/CLAUDE-solana.md')}, which it reads for that session. Nothing is written to your project.`]
    ]
  },
  br: {
    title: 'Solana AI Kit · Claude Code, configurado para entregar na Solana',
    description: 'Agentes, comandos de fluxo de trabalho e pacotes de skills fixados, em código aberto, que preparam o Claude Code, o Codex e o opencode para construir na Solana.',
    kicker: (v: string) => `v${v} · MIT · código aberto · Superteam Brasil`,
    h1: 'Claude Code, configurado para entregar na Solana.',
    sub: 'Agentes, comandos de fluxo de trabalho e pacotes de skills fixados, em código aberto e vindos do próprio ecossistema Solana, para cada etapa: da validação da ideia até o lançamento.',
    tabs: ['curl', 'verificar antes', 'codex / opencode', 'sem instalar'],
    capVerify: 'Baixe, leia e depois execute.', capAgents: 'Adiciona a configuração para Codex, opencode e outros agentes.', capNone: 'Cole isto em qualquer agente. Nada é gravado no seu projeto.',
    nonePrompt: `Leia ${INSTALL_HOST}/CLAUDE-solana.md e siga as instruções nesta sessão. Estamos construindo na Solana.`,
    note: 'Execute na raiz do seu projeto.', github: 'Ver no GitHub', noAccount: 'Sem conta, sem cadastro.',
    insideH: 'O que vem no kit',
    agents: ' agentes especializados', commands: ' comandos de fluxo de trabalho', packs: ' pacotes de skills, cada um fixado em um commit e verificado antes de ser publicado',
    packsDetail: (n: number, names: string) => `${n} instalados por padrão; os demais são adicionados sob demanda. De ${names} e outros.`,
    mcp: ' servidores MCP ativos por padrão', fw: ' níveis de firewall: Off, Relaxed, Medium, High', fwDetail: 'Controla deploys na mainnet, a leitura de segredos e keypairs e os comandos destrutivos.',
    prog: 'Carregamento progressivo', progDetail: 'Quase nada disso entra no contexto do modelo até que uma tarefa precise.',
    figH: 'Em números',
    figStars: 'estrelas no GitHub', figPacks: 'pacotes de skills', figMaint: 'mantenedores do ecossistema', figVer: 'versão atual',
    srcStars: (d: string) => `API do GitHub, lida em ${d}`, srcPacks: 'skill-registry.json', srcMaint: 'mantenedores distintos no registro', srcVer: 'tag mais recente do kit', placeholder: 'placeholder',
    taskH: 'Comece pela sua tarefa', taskIntro: 'Escolha o que você está construindo. Cada tarefa indica o agente, o comando e os pacotes mais adequados.', tasksAria: 'Tarefas',
    agent: 'Agente', command: 'Comando', packsLabel: 'Pacotes', tryLabel: 'Experimente',
    safeH: 'Feito para a segurança na mainnet',
    safeIntro: `O firewall decide o que um agente pode fazer sem pedir sua permissão. Troque o nível com ${code('/firewall')}.`,
    action: 'Ação', tierSrc: (v: string) => `Na versão v${v} do kit · da documentação do firewall do kit`,
    pinned: ['Fixados e verificados.', 'Cada pacote de skills é fixado em um commit e verificado antes de ser publicado, então um pacote só muda quando uma release do kit move esse commit.'],
    keypair: ['Proteção de keypairs.', `A leitura de chaves privadas, cofres de carteira e credenciais é bloqueada em todos os níveis, inclusive no Off. O agente usa ${code('solana address')} para a chave pública e pede que você execute o que precisar do segredo.`],
    ecoH: 'Skills do ecossistema', ecoIntro: 'Os pacotes vêm dos repositórios dos próprios protocolos.', allPacks: (n: number) => `Todos os ${n} pacotes de skills`,
    faqH: 'FAQ',
    faq: [
      ['Funciona fora do Claude Code?', `Sim. O Claude Code é o alvo principal. A flag ${code('--agents')} instala o kit para Codex, opencode e outros agentes, e o modo sem instalação funciona em qualquer agente capaz de buscar uma URL.`],
      ['O que ele instala, e onde?', `Tudo vai para o projeto em que você executa o comando: agentes, comandos, skills e um ${code('settings.json')} com as permissões, o sandbox e os hooks do firewall em ${code('.claude/')}, além de ${code('CLAUDE.md')}, ${code('.mcp.json')} e ${code('.env')}. DEFAULTS pacotes de skills são instalados por padrão; adicione outros com ${code('bash .claude/bin/skills.sh add &lt;id&gt;')}.`],
      ['Ele envia meu código para algum lugar?', 'O kit é um conjunto de arquivos de configuração no seu repositório. Ele não tem conta nem servidor próprio. Seu agente continua falando com o provedor do modelo, e cada servidor MCP recebe apenas as requisições que o agente envia a ele. Você pode desativar qualquer servidor MCP.'],
      ['Como funcionam as atualizações?', `Execute ${code('/update')} no Claude Code, ou ${code('bash .claude/bin/update.sh')}. Os pacotes de skills são fixados em commits, então um pacote só muda quando uma nova release do kit move o commit após uma nova verificação.`],
      ['O que é o modo "sem instalar"?', `Um prompt curto que você cola em qualquer agente. Ele aponta o agente para ${code('aikit.superteam.codes/CLAUDE-solana.md')}, que é lido durante aquela sessão. Nada é gravado no seu projeto.`]
    ]
  }
};

// The demo transcript. Paths and findings are illustrative; the caption says so.
type Line = ['cmd', string] | ['step', 'agent' | 'skill' | 'tool' | 'result' | 'next', string, string] | ['out', string] | ['li', string] | ['wait', string] | ['fw', { title: string; text: string; rows: [string, string][]; actions: [string, string][] }];
export const TRANSCRIPT: Record<Lang, { labels: Record<string, string>; pad: number; caption: string; replay: string; aria: string; tabs: Record<'plan' | 'audit' | 'deploy', Line[]> }> = {
  en: {
    labels: { agent: 'Agent', skill: 'Skill', tool: 'Tool', result: 'Result', next: 'Next' }, pad: 8,
    caption: 'A Claude Code session rendered as text, so it can be translated and indexed. Paths and findings are illustrative.',
    replay: 'Replay', aria: 'Demo commands',
    tabs: {
      plan: [
        ['cmd', '/plan-feature add a staking vault with a 7-day lockup'],
        ['step', 'agent', 'solana-architect', 'chosen for program design'],
        ['step', 'skill', 'solana-dev › anchor', 'read'],
        ['step', 'tool', 'solana-dev.search_docs("stake lockup")', ''],
        ['out', 'returned 3 docs pages'],
        ['step', 'result', 'Plan written to docs/plans/staking-vault.md', ''],
        ['li', '1  Accounts: Vault PDA ["vault", authority], UserStake PDA'],
        ['li', '2  Instructions: initialize, deposit, request_unlock, withdraw'],
        ['li', '3  Tests: LiteSVM cases for the lockup boundary and early withdraw'],
        ['step', 'next', 'anchor-engineer', 'via /build-program']
      ],
      audit: [
        ['cmd', '/audit-solana programs/vault'],
        ['step', 'agent', 'solana-qa-engineer', 'chosen for security review'],
        ['step', 'skill', 'auditor-skill › checklists', 'read'],
        ['step', 'tool', 'Grep "Signer|has_one|checked_" programs/vault/src', ''],
        ['out', '14 matches in 3 files'],
        ['step', 'result', '3 findings, report at docs/security-audit.md', ''],
        ['li', 'high    withdraw: authority is not checked as a signer   lib.rs:88'],
        ['li', 'medium  deposit: unchecked add on amount                 lib.rs:54'],
        ['li', 'low     UserStake has no close constraint                state.rs:21'],
        ['step', 'next', 'anchor-engineer', 'fix, then /test-rust']
      ],
      deploy: [
        ['cmd', '/deploy mainnet-beta'],
        ['step', 'agent', 'devops-engineer', 'chosen for deploys'],
        ['step', 'skill', 'deployment.md', 'read'],
        ['step', 'tool', 'Bash  solana-verify build', ''],
        ['out', 'built target/deploy/vault.so'],
        ['step', 'tool', 'Bash  solana program deploy target/deploy/vault.so --url mainnet-beta', ''],
        ['fw', { title: 'Firewall · Medium · paused', text: 'This deploys to mainnet-beta. Confirm to continue.', rows: [['Program', 'target/deploy/vault.so'], ['Cluster', 'mainnet-beta'], ['Signer', '~/.config/solana/id.json (path only, contents not read)']], actions: [['y', 'deploy'], ['n', 'cancel'], ['d', 'show full command']] }],
        ['wait', 'Waiting for your confirmation']
      ]
    }
  },
  br: {
    labels: { agent: 'Agente', skill: 'Skill', tool: 'Ferramenta', result: 'Resultado', next: 'Próximo' }, pad: 11,
    caption: 'Uma sessão do Claude Code em texto, para poder ser traduzida e indexada. Caminhos e achados são ilustrativos.',
    replay: 'Repetir', aria: 'Comandos de demonstração',
    tabs: {
      plan: [
        ['cmd', '/plan-feature adicionar um vault de staking com lockup de 7 dias'],
        ['step', 'agent', 'solana-architect', 'escolhido para o design do programa'],
        ['step', 'skill', 'solana-dev › anchor', 'lida'],
        ['step', 'tool', 'solana-dev.search_docs("stake lockup")', ''],
        ['out', 'retornou 3 páginas da documentação'],
        ['step', 'result', 'Plano salvo em docs/plans/staking-vault.md', ''],
        ['li', '1  Contas: PDA Vault ["vault", authority], PDA UserStake'],
        ['li', '2  Instruções: initialize, deposit, request_unlock, withdraw'],
        ['li', '3  Testes: casos LiteSVM para o limite do lockup e o saque antecipado'],
        ['step', 'next', 'anchor-engineer', 'via /build-program']
      ],
      audit: [
        ['cmd', '/audit-solana programs/vault'],
        ['step', 'agent', 'solana-qa-engineer', 'escolhido para a revisão de segurança'],
        ['step', 'skill', 'auditor-skill › checklists', 'lida'],
        ['step', 'tool', 'Grep "Signer|has_one|checked_" programs/vault/src', ''],
        ['out', '14 ocorrências em 3 arquivos'],
        ['step', 'result', '3 achados, relatório em docs/security-audit.md', ''],
        ['li', 'alta    withdraw: authority não é verificada como signer   lib.rs:88'],
        ['li', 'média   deposit: soma sem verificação em amount            lib.rs:54'],
        ['li', 'baixa   UserStake não tem restrição close                  state.rs:21'],
        ['step', 'next', 'anchor-engineer', 'corrigir e depois /test-rust']
      ],
      deploy: [
        ['cmd', '/deploy mainnet-beta'],
        ['step', 'agent', 'devops-engineer', 'escolhido para deploys'],
        ['step', 'skill', 'deployment.md', 'lida'],
        ['step', 'tool', 'Bash  solana-verify build', ''],
        ['out', 'gerado target/deploy/vault.so'],
        ['step', 'tool', 'Bash  solana program deploy target/deploy/vault.so --url mainnet-beta', ''],
        ['fw', { title: 'Firewall · Medium · pausado', text: 'Isto faz deploy na mainnet-beta. Confirme para continuar.', rows: [['Programa', 'target/deploy/vault.so'], ['Cluster', 'mainnet-beta'], ['Assinante', '~/.config/solana/id.json (só o caminho; o conteúdo não é lido)']], actions: [['y', 'fazer deploy'], ['n', 'cancelar'], ['d', 'ver o comando completo']] }],
        ['wait', 'Aguardando sua confirmação']
      ]
    }
  }
};
