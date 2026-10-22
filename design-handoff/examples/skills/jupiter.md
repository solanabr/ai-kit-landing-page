---
id: jupiter
name: Jupiter Agent Skills
type: skill-pack
maintainer: jup-ag
official: true
license: MIT
source: https://github.com/jup-ag/agent-skills
commit: a2211e3f6a7caa03310c7a9a8d816e723b0bdc5f
install: bash .claude/bin/skills.sh add jupiter
url: https://aikit.superteam.codes/skills/jupiter
---

# Jupiter Agent Skills

Jupiter's official skills: integrating-jupiter (swap, lend, perps, trigger, recurring), jupiter-lend, jupiter-swap-migration, jupiter-vrfd.

## Use it when
- Jupiter
- token swaps
- Jupiter Lend
- perps
- trigger orders
- recurring orders

## Install
Installed kit:

```bash
bash .claude/bin/skills.sh add jupiter
```

No install: fetch https://aikit.superteam.codes/skills/jupiter.md

## What's inside
- integrating-jupiter: Swap, lend, perps, trigger and recurring orders.
- jupiter-lend: Jupiter Lend.
- jupiter-swap-migration: Migrating an existing swap integration.
- jupiter-vrfd: Read from the skill's SKILL.md at build.

## Safety review
Scanned at a2211e3: no shell execution, no network calls outside Jupiter's documented API hosts, and no instructions to read keypairs or secrets.

- The scan covered all four skills and their reference files at the pinned commit.
- Network access in code samples is limited to Jupiter API hosts named in the skill text.
- Swap examples build transactions for the user to sign; none sign with a local keypair.
- No obfuscated content, encoded payloads or instructions that ask the agent to change its own configuration were found.

## Used by
- Agents: defi-engineer
- Commands: /plan-feature