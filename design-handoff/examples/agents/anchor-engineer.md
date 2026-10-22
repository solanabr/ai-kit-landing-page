---
id: anchor-engineer
name: anchor-engineer
type: agent
model: sonnet
license: MIT
source: https://github.com/solanabr/ai-kit/blob/main/.claude/agents/anchor-engineer.md
invoke: ask for the anchor-engineer agent
url: https://aikit.superteam.codes/agents/anchor-engineer
---

# anchor-engineer

Writes, tests and upgrades Anchor programs.

## Use it when
- Anchor program
- new instruction
- account constraints
- IDL changes

## How to invoke

```
Use the anchor-engineer agent to …
```

## What it does
- Implements instructions, accounts and constraints from a plan or a spec.
- Writes LiteSVM and Mollusk tests next to each instruction.
- Generates the IDL and keeps the TypeScript client in step.
- Checks compute usage with /profile-cu before handing off.

## Hands off to
- solana-qa-engineer
- solana-frontend-engineer
- tech-docs-writer

## Uses
- Skills: solana-dev
- Commands: /build-program, /test-rust, /profile-cu, /generate-idl-client