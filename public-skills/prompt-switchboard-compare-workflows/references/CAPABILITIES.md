# AgentGangGang MCP Capabilities

These are the MCP tools this skill expects the host to expose.

## Best first tools

- `agentganggang.bridge_status`
  - confirm the local bridge is reachable
- `agentganggang.check_readiness`
  - tell the agent which model tabs are ready before it spends the user's prompt
- `agentganggang.compare`
  - send one prompt across the ready tabs and create an inspectable compare turn

## Useful follow-through tools

- `agentganggang.analyze_compare`
  - summarize the compare turn
- `agentganggang.export_compare`
  - export the compare as Markdown or a compact local share artifact
- `agentganggang.retry_failed`
  - rerun only the failed model tabs

## Workflow tools

- `agentganggang.run_workflow`
- `agentganggang.list_workflow_runs`
- `agentganggang.get_workflow_run`
- `agentganggang.resume_workflow`

These tools are best after one real compare turn already exists.

## Session inspection tools

- `agentganggang.get_session`
- `agentganggang.list_sessions`

Use these when the user wants to inspect or export prior compare history.
