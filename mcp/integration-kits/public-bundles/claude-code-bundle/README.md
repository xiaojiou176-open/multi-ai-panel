# AgentGangGang Claude Code Bundle

This is the repo-owned public bundle packet for Claude Code.

It is meant for:

- Claude Code users who want a public, compare-first AgentGangGang setup packet
- bundle-compatible consumers such as OpenClaw that can ingest Claude-format packs

## What the bundle includes

- `.claude-plugin/plugin.json`
- `.mcp.json`
- `manifest.json`
- `commands/agentganggang.md`
- `SMOKE.md`

## Truth boundary

- AgentGangGang stays the local MCP server and browser-side product surface
- Claude Code stays the outer coding loop
- this bundle is not a marketplace listing
- this bundle is not a hosted service or SDK

## Placement

- for Claude Code itself:
  - use the packet as a reference bundle and copy the MCP block into your `.mcp.json`
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
