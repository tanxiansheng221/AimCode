# AimCode — the AI code editor that verifies before it says "done"

AimCode is a VS Code fork where the built-in AI agent ships with a **verification SDK**. The agent doesn't get to declare victory: every deliverable must survive an independent audit — contract-first scaffolding, real browser/HTTP probes, exhaustive state-machine checking — before the verdict flips from **HOLD** to **RELEASED**.

**Get it on the Microsoft Store:** https://apps.microsoft.com/detail/9NQ2LBX0CFMX

## The 23-minute exam

One English spec went in. Twenty-three minutes later a playable full-stack arcade shooter came out — 71 files, zero npm dependencies, zero human edits to the source.

**▶ See the full artifact with re-runnable evidence: [`demo/thunder-fighter/`](demo/thunder-fighter/)**

| | |
|---|---|
| Spec → verdict | 23 minutes |
| Code delivered | 71 files (56 JS modules) |
| Browser behavior probe | 19/19 asserts PASS (real clicks, real key events, real DOM) |
| Exhaustive model check | 4,361 states / 4,360 transitions, 8 invariants, 0 violations |
| Final verdict | **RELEASED** |

The evidence files in `demo/thunder-fighter/evidence/` are the SDK's own output, unedited — you can audit them yourself.

## How "done" gets verified

1. **Contract-first**: the framework auto-writes `CONTRACTS.md`, a machine-checked registry of every exported function
2. **Probes over claims**: the AI must produce a browser probe that plays the actual UI and a state-machine model for exhaustive checking — self-graded homework is rejected
3. **Independent audit**: before accepting completion, the SDK kills the server port, wipes runtime data, restarts from a clean baseline, and re-runs every check
4. **FAIL = HOLD**: a failed verification downgrades the verdict and sends the AI back to work

## Links

- Microsoft Store: https://apps.microsoft.com/detail/9NQ2LBX0CFMX
- Demo artifact: [`demo/thunder-fighter/`](demo/thunder-fighter/)
