# OpenClaw Smoke

Use this packet only after the local AgentGangGang sidecar is healthy.

## Smallest useful flow

1. `agentganggang.bridge_status`
2. `agentganggang.check_readiness`
3. `agentganggang.compare`

## Preferred full flow

1. `agentganggang.analyze_compare`
2. `agentganggang.run_workflow`
3. `agentganggang.get_workflow_run`
4. `agentganggang.list_workflow_runs`
5. `agentganggang.resume_workflow`
