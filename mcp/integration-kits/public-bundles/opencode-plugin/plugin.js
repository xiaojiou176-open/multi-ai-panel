import { tool } from '@opencode-ai/plugin';

const guideText = `MultiAiPanel OpenCode bootstrap

1. Keep the MCP server local:
   npm --prefix /absolute/path/to/MultiAiPanel run mcp:server
2. Put the MCP block into project-root opencode.jsonc
3. First smoke:
   - multi-ai-panel.bridge_status
   - multi-ai-panel.check_readiness
   - multi-ai-panel.compare
4. Full follow-through:
   - multi-ai-panel.analyze_compare
   - multi-ai-panel.run_workflow
   - multi-ai-panel.get_workflow_run
   - multi-ai-panel.list_workflow_runs
   - multi-ai-panel.resume_workflow

Truth boundary:
- MultiAiPanel stays compare-first, local-first, and browser-native
- This packet is not a hosted relay, SDK, or generic automation shell
- The package scaffold exists here, but the npm listing is not published yet`;

export const MultiAiPanelPlugin = async () => ({
  tool: {
    multi-ai-panel_bootstrap: tool({
      description: 'Print the MultiAiPanel OpenCode bootstrap and smoke flow.',
      args: {},
      async execute() {
        return guideText;
      },
    }),
  },
});

export default MultiAiPanelPlugin;
