# Codex Bundle Smoke

1. Start the local sidecar with `npm run mcp:server`.
2. Attach the bundle MCP config inside Codex.
3. Call:
   - `multi-ai-panel.bridge_status`
   - `multi-ai-panel.check_readiness`
   - `multi-ai-panel.compare`
4. If the compare lane is healthy, continue with:
   - `multi-ai-panel.analyze_compare`
   - `multi-ai-panel.run_workflow`
