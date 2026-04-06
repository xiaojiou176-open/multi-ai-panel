# Claude Code Bundle Smoke

1. Start the local sidecar with `npm run mcp:server`.
2. Attach the bundle MCP config inside Claude Code.
3. Call:
   - `agentganggang.bridge_status`
   - `agentganggang.check_readiness`
   - `agentganggang.compare`
4. If the compare lane is healthy, continue with:
   - `agentganggang.analyze_compare`
   - `agentganggang.run_workflow`
