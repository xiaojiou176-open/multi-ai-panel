---
name: multi-ai-panel
description: Use MultiAiPanel as a compare-first local MCP workspace during OpenClaw sessions.
---

# MultiAiPanel

Use this skill when OpenClaw should compare one prompt across multiple
supported AI chat tabs through the local MultiAiPanel MCP surface.

## Smallest useful flow

1. `multi-ai-panel.bridge_status`
2. `multi-ai-panel.check_readiness`
3. `multi-ai-panel.compare`

## Preferred full flow

1. `multi-ai-panel.bridge_status`
2. `multi-ai-panel.check_readiness`
3. `multi-ai-panel.compare`
4. `multi-ai-panel.analyze_compare`
5. `multi-ai-panel.run_workflow`
6. `multi-ai-panel.get_workflow_run`
7. `multi-ai-panel.list_workflow_runs`
8. `multi-ai-panel.resume_workflow`

## Boundary

- MultiAiPanel remains the compare-first browser workspace.
- OpenClaw remains the outer shell.
- This bundle assumes OpenClaw already knows how to launch the local MultiAiPanel MCP server.
