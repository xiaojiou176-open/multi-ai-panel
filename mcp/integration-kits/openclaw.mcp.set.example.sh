#!/usr/bin/env bash

# MultiAiPanel starter kit for OpenClaw.
# This follows the official `openclaw mcp set <name> <json>` path.

openclaw mcp set multi-ai-panel "$(cat <<'JSON'
{
  \"command\": \"npm\",
  \"args\": [
    \"--prefix\",
    \"/absolute/path/to/MultiAiPanel\",
    \"run\",
    \"mcp:server\"
  ]
}
JSON
)"
