import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import {
  BRIDGE_COMMAND_NAMES,
  AGENTGANGGANG_BRIDGE_HOST,
  type BridgeStateSnapshot,
} from '../src/bridge/protocol.js';
import { WorkflowExternalUpdateSchema } from '../src/substrate/api/index.js';
import { SITE_CAPABILITY_MATRIX } from '../src/utils/siteCapabilityMatrix.js';
import { MCP_ANALYSIS_PROVIDER_CATALOG } from './analysisCatalog.js';
import { AgentGangGangBridgeServer } from './bridgeServer.js';
import { MCP_MODEL_CATALOG } from './modelCatalog.js';
import { MCP_WORKFLOW_TEMPLATE_CATALOG } from './workflowCatalog.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const packageJson = JSON.parse(
  readFileSync(path.resolve(__dirname, '../package.json'), 'utf8')
) as { version: string };
const builderSupportMatrix = JSON.parse(
  readFileSync(path.resolve(__dirname, './integration-kits/support-matrix.json'), 'utf8')
) as Record<string, unknown>;
const publicDistributionMatrix = JSON.parse(
  readFileSync(path.resolve(__dirname, './integration-kits/public-distribution-matrix.json'), 'utf8')
) as Record<string, unknown>;

const BridgeToolEnvelopeSchema = z.object({
  id: z.string(),
  ok: z.boolean(),
  result: z.unknown().optional(),
  error: z
    .object({
      code: z.string(),
      message: z.string(),
      details: z.unknown().optional(),
    })
    .optional(),
});

const BridgeStatusSchema = z.object({
  connected: z.boolean(),
  extensionId: z.string().nullable(),
  lastSeenAt: z.number().nullable(),
  port: z.number().int().positive(),
});

const asToolResult = (label: string, payload: Record<string, unknown>) => ({
  content: [
    {
      type: 'text' as const,
      text: `${label}\n\n${JSON.stringify(payload, null, 2)}`,
    },
  ],
  structuredContent: payload,
});

type RegisterableMcpServer = Pick<McpServer, 'registerResource' | 'registerTool'>;
type BridgeRuntime = Pick<
  AgentGangGangBridgeServer,
  'dispatchCommand' | 'getPort' | 'getState' | 'start' | 'close'
>;
type ServerLifecycleBridge = Pick<AgentGangGangBridgeServer, 'getPort' | 'start' | 'close'>;
type ConnectableMcpServer = Pick<McpServer, 'connect'>;
type ServerRunOptions = {
  createTransport?: () => unknown;
  currentBridgeServer?: ServerLifecycleBridge;
  currentMcpServer?: ConnectableMcpServer;
  exit?: (code: number) => void;
  writeError?: (...args: unknown[]) => void;
};

export const registerAgentGangGangMcpSurface = (
  mcpServer: RegisterableMcpServer,
  bridgeServer: BridgeRuntime
) => {
  const requireState = (): BridgeStateSnapshot => bridgeServer.getState();

  const callBridge = async (
    label: string,
    command: Parameters<typeof bridgeServer.dispatchCommand>[0],
    args: Record<string, unknown>
  ) =>
    asToolResult(
      label,
      (await bridgeServer.dispatchCommand(command, args as never)) as unknown as Record<
        string,
        unknown
      >
    );

  mcpServer.registerResource(
    'agentganggang-current-session',
    'agentganggang://sessions/current',
    {
      title: 'Current AgentGangGang session',
      description: 'Latest cached snapshot of the current AgentGangGang session.',
      mimeType: 'application/json',
    },
    async () => ({
      contents: [
        {
          uri: 'agentganggang://sessions/current',
          mimeType: 'application/json',
          text: JSON.stringify(requireState().currentSession, null, 2),
        },
      ],
    })
  );

  mcpServer.registerResource(
    'agentganggang-readiness',
    'agentganggang://models/readiness',
    {
      title: 'AgentGangGang readiness snapshot',
      description: 'Latest cached per-model readiness snapshot from the extension bridge.',
      mimeType: 'application/json',
    },
    async () => ({
      contents: [
        {
          uri: 'agentganggang://models/readiness',
          mimeType: 'application/json',
          text: JSON.stringify(requireState().readiness, null, 2),
        },
      ],
    })
  );

  mcpServer.registerResource(
    'agentganggang-model-catalog',
    'agentganggang://models/catalog',
    {
      title: 'AgentGangGang model catalog',
      description: 'Supported model names, labels, hostnames, and open URLs.',
      mimeType: 'application/json',
    },
    async () => ({
      contents: [
        {
          uri: 'agentganggang://models/catalog',
          mimeType: 'application/json',
          text: JSON.stringify(MCP_MODEL_CATALOG, null, 2),
        },
      ],
    })
  );

  mcpServer.registerResource(
    'agentganggang-analysis-providers',
    'agentganggang://analysis/providers',
    {
      title: 'AgentGangGang analysis provider catalog',
      description:
        'Structured analysis-lane truth for browser-session and local Switchyard runtime execution surfaces.',
      mimeType: 'application/json',
    },
    async () => ({
      contents: [
        {
          uri: 'agentganggang://analysis/providers',
          mimeType: 'application/json',
          text: JSON.stringify(MCP_ANALYSIS_PROVIDER_CATALOG, null, 2),
        },
      ],
    })
  );

  mcpServer.registerResource(
    'agentganggang-workflow-templates',
    'agentganggang://workflows/templates',
    {
      title: 'AgentGangGang workflow template catalog',
      description:
        'Structured builder-facing catalog for the built-in AgentGangGang workflow templates and their durability boundaries.',
      mimeType: 'application/json',
    },
    async () => ({
      contents: [
        {
          uri: 'agentganggang://workflows/templates',
          mimeType: 'application/json',
          text: JSON.stringify(MCP_WORKFLOW_TEMPLATE_CATALOG, null, 2),
        },
      ],
    })
  );

  mcpServer.registerResource(
    'agentganggang-builder-support-matrix',
    'agentganggang://builder/support-matrix',
    {
      title: 'AgentGangGang builder support matrix',
      description:
        'Machine-readable truth for current supported, partial, public-bundle-ready, and planned AgentGangGang builder and consumer bindings.',
      mimeType: 'application/json',
    },
    async () => ({
      contents: [
        {
          uri: 'agentganggang://builder/support-matrix',
          mimeType: 'application/json',
          text: JSON.stringify(builderSupportMatrix, null, 2),
        },
      ],
    })
  );

  mcpServer.registerResource(
    'agentganggang-public-distribution-matrix',
    'agentganggang://builder/public-distribution',
    {
      title: 'AgentGangGang public distribution matrix',
      description:
        'Machine-readable truth for public builder bundles, official host surfaces, and current marketplace or registry claim boundaries.',
      mimeType: 'application/json',
    },
    async () => ({
      contents: [
        {
          uri: 'agentganggang://builder/public-distribution',
          mimeType: 'application/json',
          text: JSON.stringify(publicDistributionMatrix, null, 2),
        },
      ],
    })
  );

  mcpServer.registerResource(
    'agentganggang-site-capabilities',
    'agentganggang://sites/capabilities',
    {
      title: 'AgentGangGang site capability matrix',
      description:
        'Machine-readable per-site DOM, readiness, compare-path, and private-API-boundary notes for supported AgentGangGang sites.',
      mimeType: 'application/json',
    },
    async () => ({
      contents: [
        {
          uri: 'agentganggang://sites/capabilities',
          mimeType: 'application/json',
          text: JSON.stringify(SITE_CAPABILITY_MATRIX, null, 2),
        },
      ],
    })
  );

  mcpServer.registerTool(
    'agentganggang.check_readiness',
    {
      description: 'Check readiness for selected AgentGangGang model tabs.',
      inputSchema: {
        models: z
          .array(z.enum(['ChatGPT', 'Gemini', 'Perplexity', 'Qwen', 'Grok']))
          .optional(),
      },
      outputSchema: BridgeToolEnvelopeSchema,
    },
    async ({ models }) =>
      callBridge(
        'AgentGangGang readiness check result',
        BRIDGE_COMMAND_NAMES.CHECK_READINESS,
        { models }
      )
  );

  mcpServer.registerTool(
    'agentganggang.open_model_tabs',
    {
      description: 'Open or reuse supported model tabs inside AgentGangGang.',
      inputSchema: {
        models: z
          .array(z.enum(['ChatGPT', 'Gemini', 'Perplexity', 'Qwen', 'Grok']))
          .optional(),
      },
      outputSchema: BridgeToolEnvelopeSchema,
    },
    async ({ models }) =>
      callBridge(
        'AgentGangGang opened the requested model tabs',
        BRIDGE_COMMAND_NAMES.OPEN_MODEL_TABS,
        { models }
      )
  );

  mcpServer.registerTool(
    'agentganggang.compare',
    {
      description:
        'Run one AgentGangGang compare turn, persist it into session history, and fan the prompt out to ready model tabs.',
      inputSchema: {
        prompt: z.string().min(1),
        sessionId: z.string().optional(),
        models: z
          .array(z.enum(['ChatGPT', 'Gemini', 'Perplexity', 'Qwen', 'Grok']))
          .optional(),
      },
      outputSchema: BridgeToolEnvelopeSchema,
    },
    async ({ prompt, sessionId, models }) =>
      callBridge('AgentGangGang compare run queued', BRIDGE_COMMAND_NAMES.COMPARE, {
        prompt,
        sessionId,
        models,
      })
  );

  mcpServer.registerTool(
    'agentganggang.retry_failed',
    {
      description:
        'Retry failed models from an existing AgentGangGang compare turn without replaying successful ones.',
      inputSchema: {
        turnId: z.string().min(1),
        sessionId: z.string().optional(),
        models: z
          .array(z.enum(['ChatGPT', 'Gemini', 'Perplexity', 'Qwen', 'Grok']))
          .optional(),
      },
      outputSchema: BridgeToolEnvelopeSchema,
    },
    async ({ turnId, sessionId, models }) =>
      callBridge('AgentGangGang retry run queued', BRIDGE_COMMAND_NAMES.RETRY_FAILED, {
        turnId,
        sessionId,
        models,
      })
  );

  mcpServer.registerTool(
    'agentganggang.get_session',
    {
      description:
        'Fetch a persisted AgentGangGang session snapshot, including compare turns and current model statuses.',
      inputSchema: {
        sessionId: z.string().optional(),
        includeMessages: z.boolean().optional(),
      },
      outputSchema: BridgeToolEnvelopeSchema,
    },
    async ({ sessionId, includeMessages }) =>
      callBridge('AgentGangGang session snapshot', BRIDGE_COMMAND_NAMES.GET_SESSION, {
        sessionId,
        includeMessages,
      })
  );

  mcpServer.registerTool(
    'agentganggang.list_sessions',
    {
      description: 'List recent AgentGangGang sessions from local extension storage.',
      inputSchema: {
        limit: z.number().int().positive().max(50).optional(),
      },
      outputSchema: BridgeToolEnvelopeSchema,
    },
    async ({ limit }) =>
      callBridge('AgentGangGang session list', BRIDGE_COMMAND_NAMES.LIST_SESSIONS, {
        limit,
      })
  );

  mcpServer.registerTool(
    'agentganggang.export_compare',
    {
      description:
        'Export one compare turn as Markdown or as a compact local-first share summary.',
      inputSchema: {
        turnId: z.string().optional(),
        sessionId: z.string().optional(),
        format: z.enum(['markdown', 'summary']).default('markdown'),
      },
      outputSchema: BridgeToolEnvelopeSchema,
    },
    async ({ turnId, sessionId, format }) =>
      callBridge('AgentGangGang compare export', BRIDGE_COMMAND_NAMES.EXPORT_COMPARE, {
        turnId,
        sessionId,
        format,
      })
  );

  mcpServer.registerTool(
    'agentganggang.analyze_compare',
    {
      description:
        'Run the current AI Compare Analyst lane for the latest or requested compare turn.',
      inputSchema: {
        turnId: z.string().optional(),
        sessionId: z.string().optional(),
      },
      outputSchema: BridgeToolEnvelopeSchema,
    },
    async ({ turnId, sessionId }) =>
      callBridge('AgentGangGang AI compare analysis', BRIDGE_COMMAND_NAMES.ANALYZE_COMPARE, {
        turnId,
        sessionId,
      })
  );

  mcpServer.registerTool(
    'agentganggang.run_workflow',
    {
      description:
        'Start the built-in linear AgentGangGang workflow template (`compare-analyze-follow-up`) inside the governed local substrate.',
      inputSchema: {
        workflowId: z.string().min(1),
        sessionId: z.string().optional(),
        turnId: z.string().optional(),
        input: z.record(z.string(), z.unknown()).optional(),
      },
      outputSchema: BridgeToolEnvelopeSchema,
    },
    async ({ workflowId, sessionId, turnId, input }) =>
      callBridge('AgentGangGang workflow run result', BRIDGE_COMMAND_NAMES.RUN_WORKFLOW, {
        workflowId,
        sessionId,
        turnId,
        input,
      })
  );

  mcpServer.registerTool(
    'agentganggang.list_workflow_runs',
    {
      description:
        'List recent session-scoped AgentGangGang workflow snapshots for builder-side recovery or inspection.',
      inputSchema: {
        limit: z.number().int().positive().max(50).optional(),
      },
      outputSchema: BridgeToolEnvelopeSchema,
    },
    async ({ limit }) =>
      callBridge(
        'AgentGangGang workflow run list',
        BRIDGE_COMMAND_NAMES.LIST_WORKFLOW_RUNS,
        { limit }
      )
  );

  mcpServer.registerTool(
    'agentganggang.get_workflow_run',
    {
      description:
        'Fetch the latest session-scoped snapshot for one AgentGangGang workflow run.',
      inputSchema: {
        runId: z.string().min(1),
      },
      outputSchema: BridgeToolEnvelopeSchema,
    },
    async ({ runId }) =>
      callBridge(
        'AgentGangGang workflow run snapshot',
        BRIDGE_COMMAND_NAMES.GET_WORKFLOW_RUN,
        { runId }
      )
  );

  mcpServer.registerTool(
    'agentganggang.resume_workflow',
    {
      description:
        'Resume one session-scoped AgentGangGang workflow run after supplying the external step result it was waiting for.',
      inputSchema: {
        runId: z.string().min(1),
        externalUpdate: WorkflowExternalUpdateSchema.optional(),
      },
      outputSchema: BridgeToolEnvelopeSchema,
    },
    async ({ runId, externalUpdate }) =>
      callBridge(
        'AgentGangGang workflow resume result',
        BRIDGE_COMMAND_NAMES.RESUME_WORKFLOW,
        {
          runId,
          externalUpdate,
        }
      )
  );

  mcpServer.registerTool(
    'agentganggang.bridge_status',
    {
      description:
        'Report whether the local AgentGangGang extension bridge is connected to this MCP sidecar.',
      inputSchema: {},
      outputSchema: BridgeStatusSchema,
    },
    async () =>
      asToolResult('AgentGangGang bridge status', {
        connected: Boolean(requireState().extensionId),
        extensionId: requireState().extensionId ?? null,
        lastSeenAt: requireState().lastSeenAt ?? null,
        port: bridgeServer.getPort(),
      })
  );
};

export const createAgentGangGangMcpRuntime = () => {
  const bridgeServer = new AgentGangGangBridgeServer();
  const mcpServer = new McpServer({
    name: 'agentganggang',
    version: packageJson.version,
  });

  registerAgentGangGangMcpSurface(mcpServer, bridgeServer);

  return {
    bridgeServer,
    mcpServer,
  };
};

const resolveServerRuntime = (options: ServerRunOptions = {}) => {
  if (options.currentBridgeServer && options.currentMcpServer) {
    return {
      bridgeServer: options.currentBridgeServer,
      mcpServer: options.currentMcpServer,
    };
  }

  return createAgentGangGangMcpRuntime();
};

export async function runServerMain(options: ServerRunOptions = {}) {
  const { bridgeServer, mcpServer } = resolveServerRuntime(options);
  const writeError = options.writeError ?? ((...args: unknown[]) => console.error(...args));
  const createTransport = options.createTransport ?? (() => new StdioServerTransport());

  try {
    await bridgeServer.start();
    const transport = createTransport();
    await mcpServer.connect(transport as never);
    writeError(
      `AgentGangGang MCP sidecar listening on stdio with loopback bridge http://${AGENTGANGGANG_BRIDGE_HOST}:${bridgeServer.getPort()}`
    );
  } catch (error) {
    await bridgeServer.close().catch(() => undefined);
    throw error;
  }
}

export async function runServerCli(options: ServerRunOptions = {}) {
  const writeError = options.writeError ?? ((...args: unknown[]) => console.error(...args));

  try {
    await runServerMain(options);
  } catch (error) {
    writeError('AgentGangGang MCP server failed to start:', error);
    (options.exit ?? process.exit)(1);
  }
}

export async function main() {
  await runServerCli();
}

const isMainModule =
  process.argv[1] !== undefined &&
  import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;

if (isMainModule) {
  await main();
}
