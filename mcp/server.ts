import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { BRIDGE_COMMAND_NAMES, type BridgeStateSnapshot } from '../src/bridge/protocol.js';
import { WorkflowExternalUpdateSchema } from '../src/substrate/api/index.js';
import { SITE_CAPABILITY_MATRIX } from '../src/utils/siteCapabilityMatrix.js';
import { MCP_ANALYSIS_PROVIDER_CATALOG } from './analysisCatalog.js';
import { MultiAiPanelBridgeServer } from './bridgeServer.js';
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
  readFileSync(
    path.resolve(__dirname, './integration-kits/public-distribution-matrix.json'),
    'utf8'
  )
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
  MultiAiPanelBridgeServer,
  'dispatchCommand' | 'getPort' | 'getState' | 'start' | 'close'
>;
type ServerLifecycleBridge = Pick<
  MultiAiPanelBridgeServer,
  'getHost' | 'getPort' | 'start' | 'close'
>;
type ConnectableMcpServer = Pick<McpServer, 'connect'>;
type ServerRunOptions = {
  createTransport?: () => unknown;
  currentBridgeServer?: ServerLifecycleBridge;
  currentMcpServer?: ConnectableMcpServer;
  exit?: (code: number) => void;
  writeError?: (...args: unknown[]) => void;
};

export const registerMultiAiPanelMcpSurface = (
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
    'multi-ai-panel-current-session',
    'multi-ai-panel://sessions/current',
    {
      title: 'Current MultiAiPanel session',
      description: 'Latest cached snapshot of the current MultiAiPanel session.',
      mimeType: 'application/json',
    },
    async () => ({
      contents: [
        {
          uri: 'multi-ai-panel://sessions/current',
          mimeType: 'application/json',
          text: JSON.stringify(requireState().currentSession, null, 2),
        },
      ],
    })
  );

  mcpServer.registerResource(
    'multi-ai-panel-readiness',
    'multi-ai-panel://models/readiness',
    {
      title: 'MultiAiPanel readiness snapshot',
      description: 'Latest cached per-model readiness snapshot from the extension bridge.',
      mimeType: 'application/json',
    },
    async () => ({
      contents: [
        {
          uri: 'multi-ai-panel://models/readiness',
          mimeType: 'application/json',
          text: JSON.stringify(requireState().readiness, null, 2),
        },
      ],
    })
  );

  mcpServer.registerResource(
    'multi-ai-panel-model-catalog',
    'multi-ai-panel://models/catalog',
    {
      title: 'MultiAiPanel model catalog',
      description: 'Supported model names, labels, hostnames, and open URLs.',
      mimeType: 'application/json',
    },
    async () => ({
      contents: [
        {
          uri: 'multi-ai-panel://models/catalog',
          mimeType: 'application/json',
          text: JSON.stringify(MCP_MODEL_CATALOG, null, 2),
        },
      ],
    })
  );

  mcpServer.registerResource(
    'multi-ai-panel-analysis-providers',
    'multi-ai-panel://analysis/providers',
    {
      title: 'MultiAiPanel analysis provider catalog',
      description:
        'Structured analysis-lane truth for browser-session and local Switchyard runtime execution surfaces.',
      mimeType: 'application/json',
    },
    async () => ({
      contents: [
        {
          uri: 'multi-ai-panel://analysis/providers',
          mimeType: 'application/json',
          text: JSON.stringify(MCP_ANALYSIS_PROVIDER_CATALOG, null, 2),
        },
      ],
    })
  );

  mcpServer.registerResource(
    'multi-ai-panel-workflow-templates',
    'multi-ai-panel://workflows/templates',
    {
      title: 'MultiAiPanel workflow template catalog',
      description:
        'Structured builder-facing catalog for the built-in MultiAiPanel workflow templates and their durability boundaries.',
      mimeType: 'application/json',
    },
    async () => ({
      contents: [
        {
          uri: 'multi-ai-panel://workflows/templates',
          mimeType: 'application/json',
          text: JSON.stringify(MCP_WORKFLOW_TEMPLATE_CATALOG, null, 2),
        },
      ],
    })
  );

  mcpServer.registerResource(
    'multi-ai-panel-builder-support-matrix',
    'multi-ai-panel://builder/support-matrix',
    {
      title: 'MultiAiPanel builder support matrix',
      description:
        'Machine-readable truth for current supported, partial, public-bundle-ready, and planned MultiAiPanel builder and consumer bindings.',
      mimeType: 'application/json',
    },
    async () => ({
      contents: [
        {
          uri: 'multi-ai-panel://builder/support-matrix',
          mimeType: 'application/json',
          text: JSON.stringify(builderSupportMatrix, null, 2),
        },
      ],
    })
  );

  mcpServer.registerResource(
    'multi-ai-panel-public-distribution-matrix',
    'multi-ai-panel://builder/public-distribution',
    {
      title: 'MultiAiPanel public distribution matrix',
      description:
        'Machine-readable truth for public builder bundles, official host surfaces, and current marketplace or registry claim boundaries.',
      mimeType: 'application/json',
    },
    async () => ({
      contents: [
        {
          uri: 'multi-ai-panel://builder/public-distribution',
          mimeType: 'application/json',
          text: JSON.stringify(publicDistributionMatrix, null, 2),
        },
      ],
    })
  );

  mcpServer.registerResource(
    'multi-ai-panel-site-capabilities',
    'multi-ai-panel://sites/capabilities',
    {
      title: 'MultiAiPanel site capability matrix',
      description:
        'Machine-readable per-site DOM, readiness, compare-path, and private-API-boundary notes for supported MultiAiPanel sites.',
      mimeType: 'application/json',
    },
    async () => ({
      contents: [
        {
          uri: 'multi-ai-panel://sites/capabilities',
          mimeType: 'application/json',
          text: JSON.stringify(SITE_CAPABILITY_MATRIX, null, 2),
        },
      ],
    })
  );

  mcpServer.registerTool(
    'multi-ai-panel.check_readiness',
    {
      description: 'Check readiness for selected MultiAiPanel model tabs.',
      inputSchema: {
        models: z.array(z.enum(['ChatGPT', 'Gemini', 'Perplexity', 'Qwen', 'Grok'])).optional(),
      },
      outputSchema: BridgeToolEnvelopeSchema,
    },
    async ({ models }) =>
      callBridge(
        'MultiAiPanel readiness check result',
        BRIDGE_COMMAND_NAMES.CHECK_READINESS,
        { models }
      )
  );

  mcpServer.registerTool(
    'multi-ai-panel.open_model_tabs',
    {
      description: 'Open or reuse supported model tabs inside MultiAiPanel.',
      inputSchema: {
        models: z.array(z.enum(['ChatGPT', 'Gemini', 'Perplexity', 'Qwen', 'Grok'])).optional(),
      },
      outputSchema: BridgeToolEnvelopeSchema,
    },
    async ({ models }) =>
      callBridge(
        'MultiAiPanel opened the requested model tabs',
        BRIDGE_COMMAND_NAMES.OPEN_MODEL_TABS,
        { models }
      )
  );

  mcpServer.registerTool(
    'multi-ai-panel.compare',
    {
      description:
        'Run one MultiAiPanel compare turn, persist it into session history, and fan the prompt out to ready model tabs.',
      inputSchema: {
        prompt: z.string().min(1),
        sessionId: z.string().optional(),
        models: z.array(z.enum(['ChatGPT', 'Gemini', 'Perplexity', 'Qwen', 'Grok'])).optional(),
      },
      outputSchema: BridgeToolEnvelopeSchema,
    },
    async ({ prompt, sessionId, models }) =>
      callBridge('MultiAiPanel compare run queued', BRIDGE_COMMAND_NAMES.COMPARE, {
        prompt,
        sessionId,
        models,
      })
  );

  mcpServer.registerTool(
    'multi-ai-panel.retry_failed',
    {
      description:
        'Retry failed models from an existing MultiAiPanel compare turn without replaying successful ones.',
      inputSchema: {
        turnId: z.string().min(1),
        sessionId: z.string().optional(),
        models: z.array(z.enum(['ChatGPT', 'Gemini', 'Perplexity', 'Qwen', 'Grok'])).optional(),
      },
      outputSchema: BridgeToolEnvelopeSchema,
    },
    async ({ turnId, sessionId, models }) =>
      callBridge('MultiAiPanel retry run queued', BRIDGE_COMMAND_NAMES.RETRY_FAILED, {
        turnId,
        sessionId,
        models,
      })
  );

  mcpServer.registerTool(
    'multi-ai-panel.get_session',
    {
      description:
        'Fetch a persisted MultiAiPanel session snapshot, including compare turns and current model statuses.',
      inputSchema: {
        sessionId: z.string().optional(),
        includeMessages: z.boolean().optional(),
      },
      outputSchema: BridgeToolEnvelopeSchema,
    },
    async ({ sessionId, includeMessages }) =>
      callBridge('MultiAiPanel session snapshot', BRIDGE_COMMAND_NAMES.GET_SESSION, {
        sessionId,
        includeMessages,
      })
  );

  mcpServer.registerTool(
    'multi-ai-panel.list_sessions',
    {
      description: 'List recent MultiAiPanel sessions from local extension storage.',
      inputSchema: {
        limit: z.number().int().positive().max(50).optional(),
      },
      outputSchema: BridgeToolEnvelopeSchema,
    },
    async ({ limit }) =>
      callBridge('MultiAiPanel session list', BRIDGE_COMMAND_NAMES.LIST_SESSIONS, {
        limit,
      })
  );

  mcpServer.registerTool(
    'multi-ai-panel.export_compare',
    {
      description: 'Export one compare turn as Markdown or as a compact local-first share summary.',
      inputSchema: {
        turnId: z.string().optional(),
        sessionId: z.string().optional(),
        format: z.enum(['markdown', 'summary']).default('markdown'),
      },
      outputSchema: BridgeToolEnvelopeSchema,
    },
    async ({ turnId, sessionId, format }) =>
      callBridge('MultiAiPanel compare export', BRIDGE_COMMAND_NAMES.EXPORT_COMPARE, {
        turnId,
        sessionId,
        format,
      })
  );

  mcpServer.registerTool(
    'multi-ai-panel.analyze_compare',
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
      callBridge('MultiAiPanel AI compare analysis', BRIDGE_COMMAND_NAMES.ANALYZE_COMPARE, {
        turnId,
        sessionId,
      })
  );

  mcpServer.registerTool(
    'multi-ai-panel.run_workflow',
    {
      description:
        'Start the built-in linear MultiAiPanel workflow template (`compare-analyze-follow-up`) inside the governed local substrate.',
      inputSchema: {
        workflowId: z.string().min(1),
        sessionId: z.string().optional(),
        turnId: z.string().optional(),
        input: z.record(z.string(), z.unknown()).optional(),
      },
      outputSchema: BridgeToolEnvelopeSchema,
    },
    async ({ workflowId, sessionId, turnId, input }) =>
      callBridge('MultiAiPanel workflow run result', BRIDGE_COMMAND_NAMES.RUN_WORKFLOW, {
        workflowId,
        sessionId,
        turnId,
        input,
      })
  );

  mcpServer.registerTool(
    'multi-ai-panel.list_workflow_runs',
    {
      description:
        'List recent session-scoped MultiAiPanel workflow snapshots for builder-side recovery or inspection.',
      inputSchema: {
        limit: z.number().int().positive().max(50).optional(),
      },
      outputSchema: BridgeToolEnvelopeSchema,
    },
    async ({ limit }) =>
      callBridge('MultiAiPanel workflow run list', BRIDGE_COMMAND_NAMES.LIST_WORKFLOW_RUNS, {
        limit,
      })
  );

  mcpServer.registerTool(
    'multi-ai-panel.get_workflow_run',
    {
      description:
        'Fetch the latest session-scoped snapshot for one MultiAiPanel workflow run.',
      inputSchema: {
        runId: z.string().min(1),
      },
      outputSchema: BridgeToolEnvelopeSchema,
    },
    async ({ runId }) =>
      callBridge(
        'MultiAiPanel workflow run snapshot',
        BRIDGE_COMMAND_NAMES.GET_WORKFLOW_RUN,
        { runId }
      )
  );

  mcpServer.registerTool(
    'multi-ai-panel.resume_workflow',
    {
      description:
        'Resume one session-scoped MultiAiPanel workflow run after supplying the external step result it was waiting for.',
      inputSchema: {
        runId: z.string().min(1),
        externalUpdate: WorkflowExternalUpdateSchema.optional(),
      },
      outputSchema: BridgeToolEnvelopeSchema,
    },
    async ({ runId, externalUpdate }) =>
      callBridge(
        'MultiAiPanel workflow resume result',
        BRIDGE_COMMAND_NAMES.RESUME_WORKFLOW,
        {
          runId,
          externalUpdate,
        }
      )
  );

  mcpServer.registerTool(
    'multi-ai-panel.bridge_status',
    {
      description:
        'Report whether the local MultiAiPanel extension bridge is connected to this MCP sidecar.',
      inputSchema: {},
      outputSchema: BridgeStatusSchema,
    },
    async () =>
      asToolResult('MultiAiPanel bridge status', {
        connected: Boolean(requireState().extensionId),
        extensionId: requireState().extensionId ?? null,
        lastSeenAt: requireState().lastSeenAt ?? null,
        port: bridgeServer.getPort(),
      })
  );
};

export const createMultiAiPanelMcpRuntime = () => {
  const bridgeServer = new MultiAiPanelBridgeServer();
  const mcpServer = new McpServer({
    name: 'multi-ai-panel',
    version: packageJson.version,
  });

  registerMultiAiPanelMcpSurface(mcpServer, bridgeServer);

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

  return createMultiAiPanelMcpRuntime();
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
      `MultiAiPanel MCP sidecar listening on stdio with loopback bridge http://${bridgeServer.getHost()}:${bridgeServer.getPort()}`
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
    writeError('MultiAiPanel MCP server failed to start:', error);
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
