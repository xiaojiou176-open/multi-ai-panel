# AgentGangGang Codex Bundle

This is the repo-owned public bundle packet for Codex.

It is meant for:

- Codex users who want a public, compare-first AgentGangGang setup packet
- bundle-compatible consumers such as OpenClaw that can ingest Codex-format packs

## What the bundle includes

- `.codex-plugin/plugin.json`
- `.mcp.json`
- `skills/agentganggang/SKILL.md`
- `SMOKE.md`

## Truth boundary

- AgentGangGang stays the local MCP server and browser-side product surface
- Codex stays the outer coding loop
- this bundle is not a marketplace listing
- this bundle is not a hosted service or SDK

## Placement

- for Codex itself:
  - use the packet as a reference bundle and copy the MCP block into your `config.toml`
- for OpenClaw:
  - install the packed archive through the official OpenClaw bundle path

## Smallest useful smoke

1. `agentganggang.bridge_status`
2. `agentganggang.check_readiness`
3. `agentganggang.compare`

## Full follow-through

1. `agentganggang.analyze_compare`
2. `agentganggang.run_workflow`
3. `agentganggang.get_workflow_run`
4. `agentganggang.list_workflow_runs`
5. `agentganggang.resume_workflow`
