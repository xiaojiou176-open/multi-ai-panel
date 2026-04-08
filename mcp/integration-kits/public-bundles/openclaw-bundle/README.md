# AgentGangGang OpenClaw Bundle

This is the repo-owned public OpenClaw bundle packet for AgentGangGang.

It is meant for:

- OpenClaw users who want one packable AgentGangGang MCP packet
- maintainers who need a truthful bridge between the repo-owned OpenClaw starter
  assets and any later official listing work

## What the bundle includes

- `openclaw.agentganggang.json`
- `mcp.servers.json`
- `openclaw.mcp.set.sh`
- `manifest.json`
- `.codex-plugin/plugin.json`
- `skills/agentganggang/SKILL.md`
- `SMOKE.md`

## Truth boundary

- AgentGangGang stays the local MCP server and browser-side product surface
- OpenClaw stays the outer coding loop
- this bundle is not an official marketplace or registry listing
- this bundle is not a hosted service or SDK

## Placement

- fastest current path:
  - run `openclaw mcp set agentganggang "$(cat openclaw.agentganggang.json)"`
- alternative path:
  - copy `mcp.servers.json` into an OpenClaw config that already consumes
    `mcp.servers`

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
