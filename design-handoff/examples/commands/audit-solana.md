---
id: audit-solana
name: /audit-solana
type: command
model: inherit
license: MIT
source: https://github.com/solanabr/ai-kit/blob/main/.claude/commands/audit-solana.md
invoke: /audit-solana [path]
url: https://aikit.superteam.codes/commands/audit-solana
---

# /audit-solana

Reviews a program for Solana-specific security issues and writes a report.

## Use it when
- security review
- before mainnet
- audit

## How to invoke

```
/audit-solana [path]
```

## What it does
- Reads the program and its tests, then checks signer, owner and PDA constraints.
- Looks for unchecked arithmetic, missing close constraints and CPI pitfalls.
- Writes findings by severity, each with file and line, to audits/.
- Suggests fixes and hands them to the program's engineer agent.

## Routes to
- solana-qa-engineer

## Hands off to
- anchor-engineer
- pinocchio-engineer

## Uses
- Skills: solana-dev