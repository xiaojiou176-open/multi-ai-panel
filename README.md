<p align="center">
  <img src="https://em-content.zobj.net/source/apple/391/performing-arts_1f3ad.png" width="120" alt="performing arts" />
</p>

<h1 align="center">AgentGangGang</h1>

<p align="center">
  <strong>five AIs in one sidebar, one conversation, one ⌘+K</strong>
</p>

<p align="center">
  <a href="https://github.com/xiaojiou176-open/AgentGangGang/stargazers"><img src="https://img.shields.io/github/stars/xiaojiou176-open/AgentGangGang?style=flat&color=yellow" alt="Stars"></a>
  <a href="https://github.com/xiaojiou176-open/AgentGangGang/commits/main"><img src="https://img.shields.io/github/last-commit/xiaojiou176-open/AgentGangGang?style=flat" alt="Last Commit"></a>
  <a href="LICENSE"><img src="https://img.shields.io/github/license/xiaojiou176-open/AgentGangGang?style=flat" alt="License"></a>
</p>

<p align="center">
  <a href="#what-you-get">What You Get</a> •
  <a href="#install">Install</a> •
  <a href="#how-it-work">How It Work</a> •
  <a href="#ecosystem">Ecosystem</a>
</p>

---

AgentGangGang is a Chrome side panel that hosts every major AI side-by-side. One prompt, every model, side-by-side answers, no tab juggling.

```
┌──────────────────────────────────────┐
│  LOCAL-FIRST          ████████ 100%  │
│  SOURCE-TRACEABLE     ████████ 100%  │
│  TYPING REQUIRED      ░░░░░░░░   0%  │
│  VIBES                ████████ ZERO  │
│                                FILLER│
└──────────────────────────────────────┘
```

> ChatGPT, Claude, Gemini, Grok, DeepSeek — same panel, same prompt, instant compare.

## What You Get

| Surface | What |
|---|---|
| `sidepanel` | All your AIs in one Chrome panel. Hot-swap, compare, fork. |
| `⌘+K compare mode` | Send the same prompt to N agents. See answers next to each other. |
| `mcp bridge` | AgentGangGang doubles as an MCP server for downstream agents. |
| `public skills` | Drop into Claude/Codex/OpenClaw. Spawn the gang on demand. |

> [!IMPORTANT]
> Local-first by default. No silent telemetry. No cloud round-trip. Your data stays on your machine until you explicitly ship it somewhere.

## Install

```bash
git clone https://github.com/xiaojiou176-open/AgentGangGang.git
cd AgentGangGang
# follow the per-stack quickstart in INSTALL.md or docs/
```

Three commands. No `curl | sh`. No login. Read what you run.

Install break? Open your favorite agent and say *"Read AGENTS.md and bootstrap AgentGangGang for me."* Agent fix own brain. Long version: [`docs/`](./docs/).

## How It Work

The repo is seven layers — exactly the seven commits in `git log`. New work goes in as small named PRs. No 50-file mystery commits.

| Layer | What |
|---|---|
| `chore: scaffold` | License, governance, hygiene gates, CI scaffolding. |
| `feat(core)` | The primary engine. The reason AgentGangGang exists. |
| `feat(modules)` | Packages, adapters, services, plugins. The second floor. |
| `feat(contracts)` | Schemas, configs, public boundaries. Other code talks here. |
| `test:` | Receipts. Everything in this layer must run. |
| `feat(ops)` | Scripts, infra, CI helpers, build glue. |
| `docs:` | Public docs surface. The pretty face. |

`git log` reads like a building floor plan. Look once, know the whole shape.

## Ecosystem

AgentGangGang lives in the ***Me family**: three personal tools. command-style names, stupid-simple jobs.

| Repo | What |
|---|---|
| [**BeamMe**](https://github.com/xiaojiou176-open/BeamMe) | beam your agent config to any planet |
| [**BrewMe**](https://github.com/xiaojiou176-open/BrewMe) | wake up, news already brewed |
| [**AgentGangGang**](https://github.com/xiaojiou176-open/AgentGangGang) *(you here)* | five AIs in one sidebar |

Cross-family taste:
[**BeamMe**](https://github.com/xiaojiou176-open/BeamMe) ·
[**BrewMe**](https://github.com/xiaojiou176-open/BrewMe) ·
[**OpenVibeCoding**](https://github.com/xiaojiou176-open/OpenVibeCoding) ·
[**proofyard**](https://github.com/xiaojiou176-open/proofyard).

## Star This Repo

If AgentGangGang saves you a click, an hour, or a headache — star costs zero. Fair trade. ⭐

[![Star History Chart](https://api.star-history.com/svg?repos=xiaojiou176-open/AgentGangGang&type=Date)](https://star-history.com/#xiaojiou176-open/AgentGangGang&Date)

## Also by Yifeng[Terry] Yu

- **[BeamMe](https://github.com/xiaojiou176-open/BeamMe)** — beam your agent config to any planet
- **[BrewMe](https://github.com/xiaojiou176-open/BrewMe)** — wake up, news already brewed
- **[OpenVibeCoding](https://github.com/xiaojiou176-open/OpenVibeCoding)** — AI codes overnight, you ship in the morning
- **[proofyard](https://github.com/xiaojiou176-open/proofyard)** — every claim ships with its receipt
- **[dealyard](https://github.com/xiaojiou176-open/dealyard)** — let prices fight, you sit and watch

## License

MIT — small print, big freedom.
