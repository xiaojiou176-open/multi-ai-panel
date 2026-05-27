# Install and Connect MultiAiPanel MCP

This guide avoids private paths and keeps the install loop portable.

## What you need

- a local clone of `https://github.com/xiaojiou176-open/multi-ai-panel`
- Node.js and npm
- the MultiAiPanel browser extension installed and able to reach its side panel
- at least two supported AI chat tabs signed in and open

## 1. Clone and install the repo

```bash
git clone https://github.com/xiaojiou176-open/multi-ai-panel.git
cd MultiAiPanel
npm install
```

## 2. Make the MCP server launchable

MultiAiPanel exposes its MCP server through the repo-owned script:

```bash
npm --prefix /absolute/path/to/MultiAiPanel run mcp:server
```

You do not need to invent a new wrapper. Reuse that command in your host config.

## 3. Connect it in an OpenHands-style host

Copy and edit [OPENHANDS_MCP_CONFIG.json](OPENHANDS_MCP_CONFIG.json) so the
absolute path points at your local clone.

## 4. Connect it in OpenClaw

Copy and edit [OPENCLAW_MCP_CONFIG.json](OPENCLAW_MCP_CONFIG.json), then load it
into your OpenClaw MCP configuration.

## 5. Verify the smallest useful loop

Once the host can see the server, run this tool sequence:

1. `multi-ai-panel.bridge_status`
2. `multi-ai-panel.check_readiness`
3. `multi-ai-panel.compare`

If that loop works, the host wiring is good enough for a real compare-first
workflow.
