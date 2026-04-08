# OpenHands / OpenClaw Demo Walkthrough

This is the shortest concrete demo you can run to prove the skill is doing real
work instead of just existing as prose.

## Demo prompt

Use AgentGangGang to compare this rewrite request across the ready ChatGPT
and Gemini tabs:

> Rewrite the following onboarding email so it sounds warmer and 30% shorter.

Start with `agentganggang.bridge_status` and
`agentganggang.check_readiness`. If both tabs are ready, run
`agentganggang.compare`. After the compare turn lands, use
`agentganggang.analyze_compare` to summarize the biggest wording
differences and recommend which answer is better for a friendly product update.

## Expected tool sequence

1. `agentganggang.bridge_status`
2. `agentganggang.check_readiness`
3. `agentganggang.compare`
4. `agentganggang.analyze_compare`

## Visible success criteria

- the agent names which tabs are ready instead of guessing
- the compare step creates a real turn/session artifact
- the analysis step refers back to the compare output instead of inventing text

## OpenClaw variant

Use the same prompt after loading the MCP config from
[OPENCLAW_MCP_CONFIG.json](OPENCLAW_MCP_CONFIG.json). The success criteria stay
the same: bridge, readiness, compare, then analysis.
