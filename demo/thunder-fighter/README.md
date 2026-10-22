# THUNDER FIGHTER — an AI wrote this in 23 minutes

> One English spec went in. A playable full-stack arcade shooter came out.
> Nothing was merged until an independent verification pass said **RELEASED**.

This is a real, unedited deliverable produced by **[AimCode](https://apps.microsoft.com/detail/9NQ2LBX0CFMX)** — a VS Code fork with a built-in verification SDK — during a timed, fully-English exam. The AI agent planned, wrote, and self-tested the entire codebase. A human never touched the source files.

## The rules of the exam

- Input: **one English spec** (arcade shooter, full-stack, vanilla JS, 9 backend entities, ≥50 code files, full English UI)
- The AI must deliver a **browser behavior probe** (`test/probe.txt`) and a **state-machine model** (`test/model.js`) — no self-graded homework allowed
- "Done" is not what the AI *claims*. Completion is only accepted after the SDK independently re-runs the evidence: kill port → clean data → restart baseline → re-execute probe and model check
- If verification fails, the verdict is downgraded from **RELEASED** to **HOLD**

## Result

| | |
|---|---|
| Spec → verdict | **23 minutes** |
| Code files delivered | **71** (56 JavaScript modules) |
| npm dependencies | **0** (pure Node.js `http` + browser Canvas 2D) |
| Backend entities | pilots, runs, loadouts, enemies, waves, scores, replays, reviews, notifications |
| Final verdict | **RELEASED** |

## Verification evidence (in `evidence/`)

| Check | What it actually did | Result |
|---|---|---|
| `verify-result.json` | SDK full audit: syntax × 55 files + model check re-run | **ALL_PASS**, 19.2s |
| `evidence/probe.txt` | Browser probe driving the **real UI**: register pilot → leaderboard renders → click START → move & fire → pause/resume → HUD assertions | **19/19 asserts PASS**, zero console errors |
| `evidence/probe-result.json` | Machine-readable probe verdict | **PASS** |
| `evidence/modelcheck-result.json` | Exhaustive state-machine exploration | **4,361 reachable states / 4,360 transitions**, 8 invariants, 0 violations |
| `evidence/scorecard.json` | Final verdict recorded by the framework | **RELEASED**, 75 rounds, 81 file writes |

The probe is not `@eval` trickery — it dispatches real `KeyboardEvent`s, clicks real buttons, and asserts against the real DOM. The model check exhausts the game's state machine up to depth 3 and verifies every invariant on every reachable state.

## Run it

```bash
node server.js
# → http://localhost:8808
```

Requires Node ≥ 18. No `npm install` — there is nothing to install.

Register a pilot, then play: **← →** move, **Space** fire, **P** pause. Scores go to the leaderboard; enemies escalate across waves (scout → fighter → heavy → elite → boss).

## What's in the box

```
├── server.js / app.js        zero-dependency HTTP server + static hosting
├── routes/  services/        9 entity REST APIs (auth via hand-rolled JWT)
├── validators/               input validation per entity
├── middleware/               auth, rate limit, error handler, role check
├── public/                   the game itself (Canvas 2D, neon theme)
├── data/                     JSON file storage (seeded on boot)
├── test/                     probe + model + machine-readable verdicts
├── CONTRACTS.md              auto-generated interface registry of every module
└── evidence/                 the verification artifacts, unedited
```

`CONTRACTS.md` is written by the framework after every file write — it is the machine-checked map of every exported function, which is what the AI reads instead of re-reading source files.

## Honest scope

This is an exam artifact, not a production service: JSON-file storage instead of a database, a hand-rolled JWT instead of a battle-tested library, single-process deployment. The point of this repo is not the game — it's that **every claim of "done" above is backed by a re-runnable evidence file you can check yourself**.

## About AimCode

AimCode is a VS Code fork where the AI agent ships with a verification SDK: contract-first scaffolding, browser/HTTP probes, exhaustive model checking, and a delivery gate that refuses to accept unverified "done". Available on the Microsoft Store:

**https://apps.microsoft.com/detail/9NQ2LBX0CFMX**
