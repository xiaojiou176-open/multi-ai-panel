# MultiAiPanel OpenClaw Bundle

This is the repo-owned public OpenClaw bundle packet for MultiAiPanel.

It is meant for:

- OpenClaw users who want one packable MultiAiPanel MCP packet
- maintainers who need a truthful bridge between the repo-owned OpenClaw starter
  assets and any later official listing work

## What the bundle includes

- `openclaw.multi-ai-panel.json`
- `mcp.servers.json`
- `openclaw.mcp.set.sh`
- `manifest.json`
- `.codex-plugin/plugin.json`
- `skills/multi-ai-panel/SKILL.md`
- `SMOKE.md`

## Truth boundary

- MultiAiPanel stays the local MCP server and browser-side product surface
- OpenClaw stays the outer coding loop
- this bundle is not an official marketplace or registry listing
- this bundle is not a hosted service or SDK

## Placement

- fastest current path:
  - run `openclaw mcp set multi-ai-panel "$(cat openclaw.multi-ai-panel.json)"`
- alternative path:
  - copy `mcp.servers.json` into an OpenClaw config that already consumes
    `mcp.servers`

## Smallest useful smoke

1. `multi-ai-panel.bridge_status`
2. `multi-ai-panel.check_readiness`
3. `multi-ai-panel.compare`

## Full follow-through

1. `multi-ai-panel.analyze_compare`
2. `multi-ai-panel.run_workflow`
3. `multi-ai-panel.get_workflow_run`
4. `multi-ai-panel.list_workflow_runs`
5. `multi-ai-panel.resume_workflow`
