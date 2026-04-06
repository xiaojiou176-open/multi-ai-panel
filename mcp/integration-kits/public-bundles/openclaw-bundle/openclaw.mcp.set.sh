#!/usr/bin/env bash

# AgentGangGang public bundle packet for OpenClaw.
# This stays on the official `openclaw mcp set <name> <json>` path.

openclaw mcp set agentganggang "$(cat <<'JSON'
{
  \"command\": \"npm\",
  \"args\": [
    \"--prefix\",
    \"/absolute/path/to/agentganggang\",
    \"run\",
    \"mcp:server\"
  ]
}
JSON
)"
