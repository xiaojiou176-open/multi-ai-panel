# MultiAiPanel MCP Capabilities

These are the MCP tools this skill expects the host to expose.

## Best first tools

- `multi-ai-panel.bridge_status`
  - confirm the local bridge is reachable
- `multi-ai-panel.check_readiness`
  - tell the agent which model tabs are ready before it spends the user's prompt
- `multi-ai-panel.compare`
  - send one prompt across the ready tabs and create an inspectable compare turn

## Useful follow-through tools

- `multi-ai-panel.analyze_compare`
  - summarize the compare turn
- `multi-ai-panel.export_compare`
  - export the compare as Markdown or a compact local share artifact
- `multi-ai-panel.retry_failed`
  - rerun only the failed model tabs

## Workflow tools

- `multi-ai-panel.run_workflow`
- `multi-ai-panel.list_workflow_runs`
- `multi-ai-panel.get_workflow_run`
- `multi-ai-panel.resume_workflow`

These tools are best after one real compare turn already exists.

## Session inspection tools

- `multi-ai-panel.get_session`
- `multi-ai-panel.list_sessions`

Use these when the user wants to inspect or export prior compare history.
