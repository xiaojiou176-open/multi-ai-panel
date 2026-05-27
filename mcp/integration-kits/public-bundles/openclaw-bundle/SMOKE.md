# OpenClaw Smoke

Use this packet only after the local MultiAiPanel sidecar is healthy.

## Smallest useful flow

1. `multi-ai-panel.bridge_status`
2. `multi-ai-panel.check_readiness`
3. `multi-ai-panel.compare`

## Preferred full flow

1. `multi-ai-panel.analyze_compare`
2. `multi-ai-panel.run_workflow`
3. `multi-ai-panel.get_workflow_run`
4. `multi-ai-panel.list_workflow_runs`
5. `multi-ai-panel.resume_workflow`
