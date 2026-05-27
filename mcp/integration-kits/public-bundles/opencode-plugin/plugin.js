import { tool } from '@opencode-ai/plugin';

const guideText = `AgentGangGang OpenCode bootstrap

1. Keep the MCP server local:
   npm --prefix /absolute/path/to/AgentGangGang run mcp:server
2. Put the MCP block into project-root opencode.jsonc
3. First smoke:
   - agentganggang.bridge_status
   - agentganggang.check_readiness
   - agentganggang.compare
4. Full follow-through:
   - agentganggang.analyze_compare
   - agentganggang.run_workflow
   - agentganggang.get_workflow_run
   - agentganggang.list_workflow_runs
   - agentganggang.resume_workflow

Truth boundary:
- AgentGangGang stays compare-first, local-first, and browser-native
- This packet is not a hosted relay, SDK, or generic automation shell
- The package scaffold exists here, but the npm listing is not published yet`;

export const AgentGangGangPlugin = async () => ({
  tool: {
    agentganggang_bootstrap: tool({
      description: 'Print the AgentGangGang OpenCode bootstrap and smoke flow.',
      args: {},
      async execute() {
        return guideText;
      },
    }),
  },
});

export default AgentGangGangPlugin;
