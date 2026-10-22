---
id: solana-dev
name: Solana Dev Skill
type: skill-pack
maintainer: solana-foundation
official: true
license: MIT
source: https://github.com/solana-foundation/solana-dev-skill
commit: 674da5a
install: bash .claude/bin/skills.sh add solana-dev
url: https://aikit.superteam.codes/skills/solana-dev
---

# Solana Dev Skill

Solana Foundation development skill: Anchor 1.x and Pinocchio programs, @solana/kit clients, LiteSVM, Mollusk and Surfpool testing, security, Token-2022, payments.

## Use it when
- Solana programs
- Anchor
- Pinocchio
- @solana/kit
- program tests
- security review

## Install
Installed kit:

```bash
bash .claude/bin/skills.sh add solana-dev
```

No install: fetch https://aikit.superteam.codes/skills/solana-dev.md

## What's inside
- anchor: Anchor 1.x programs: accounts, constraints, CPIs, IDL.
- pinocchio: Pinocchio programs with zero-copy accounts.
- kit-clients: @solana/kit clients and transaction building.
- testing: LiteSVM, Mollusk and Surfpool test setups.
- security: Program security review checklist.
- token-2022: Token-2022 mints and extensions.
- payments: Payment flows on Solana.

## Safety review
Scanned at 674da5a: documentation and code samples only; no shell execution or network calls in the skill files.

- The scan covered every file in the pack at the pinned commit.
- No skill instructs the agent to read keypairs, wallets or environment secrets.
- Code samples that deploy programs target localnet or devnet.

## Used by
- Agents: solana-architect, anchor-engineer, pinocchio-engineer, solana-qa-engineer
- Commands: /plan-feature, /build-program, /audit-solana, /deploy