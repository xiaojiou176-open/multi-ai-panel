#!/usr/bin/env bash

# AgentGangGang starter kit for OpenClaw.
# This follows the official `openclaw mcp set <name> <json>` path.

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
