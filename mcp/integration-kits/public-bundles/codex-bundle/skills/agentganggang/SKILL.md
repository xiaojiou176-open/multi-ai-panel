---
name: agentganggang
description: Use AgentGangGang as a compare-first local MCP workspace during Codex sessions.
---

# AgentGangGang

Use this skill when Codex should compare one prompt across multiple supported AI
chat tabs through the local AgentGangGang MCP surface.

## Smallest useful flow

1. `agentganggang.bridge_status`
2. `agentganggang.check_readiness`
3. `agentganggang.compare`

## Preferred full flow

1. `agentganggang.bridge_status`
2. `agentganggang.check_readiness`
3. `agentganggang.compare`
4. `agentganggang.analyze_compare`
5. `agentganggang.run_workflow`
6. `agentganggang.get_workflow_run`
7. `agentganggang.list_workflow_runs`
8. `agentganggang.resume_workflow`

## Boundary

- AgentGangGang remains the compare-first browser workspace.
- Codex remains the outer coding loop.
- This bundle assumes Codex already knows how to launch the local AgentGangGang MCP server.
