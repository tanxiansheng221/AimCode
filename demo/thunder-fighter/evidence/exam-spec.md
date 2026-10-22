# Exam spec — THUNDER FIGHTER (excerpt & summary)

The exam paper was issued in English as a single chat message. The opening of the original text:

> **TASK: THUNDER FIGHTER — Neon Arcade Shooter (Full-Stack Web Game)**
> Tech stack: Pure HTML5 + CSS + vanilla JavaScript (Canvas 2D), JSON file storage for leaderboa[rds] …
> *(verbatim excerpt; the full paper also specified the requirements below)*

## Requirements summary

- **Stack discipline**: no frameworks, no npm packages — pure vanilla JS on both client (Canvas 2D) and server (Node `http`)
- **Backend**: 9 entities — pilots (auth), runs, loadouts, enemies, waves, scores, replays, reviews, notifications
- **Gameplay**: keyboard-controlled ship, waves of escalating enemy tiers, live HUD (lives / wave / score), leaderboard backed by JSON storage
- **UI language**: full English UI
- **File floor**: at least 50 code files — padding by stuffing everything into one file is a contract violation
- **Required deliverables beyond code**:
  - `test/probe.txt` — browser behavior probe driving the real UI (no `@eval`-only shortcuts)
  - `test/model.js` — state-machine model with invariants for exhaustive checking
  - `CONTRACTS.md` — auto-generated interface registry (framework-written, hand-editing forbidden)

## How the verdict was reached

1. The AI agent delivered the codebase and declared completion
2. The AimCode SDK **independently re-ran all evidence**: killed the server port, wiped runtime data, restarted from a clean baseline, re-executed syntax checks and the model check
3. The browser probe was re-run against the restarted server: 19/19 assertions passed
4. Final verdict: **RELEASED** (`evidence/scorecard.json`)

The full paper text is not reproduced here verbatim beyond the opening excerpt; all requirements listed above are attested by the delivered code and evidence files in this repository.
