import { readFileSync } from 'node:fs';
import path from 'node:path';

const repoRoot = process.cwd();

const read = (relPath) => readFileSync(path.join(repoRoot, relPath), 'utf8');
const stripJsonComments = (text) =>
  text
    .replace(/^\s*\/\/.*$/gm, '')
    .replace(/\/\*[\s\S]*?\*\//g, '');

const findings = [];
const PATH_PLACEHOLDER = '/absolute/path/to/agentganggang';
const FORBIDDEN_LOCAL_PATH_PATTERNS = ['/Users/', '/home/', 'C:\\Users\\'];

const codexKit = read('mcp/integration-kits/codex.config.toml.example');
if (!codexKit.includes('[mcp_servers.agentganggang]')) {
  findings.push('Codex starter kit is missing the agentganggang TOML block.');
}

const claudeKit = JSON.parse(read('mcp/integration-kits/claude.mcp.json.example'));
if (claudeKit?.mcpServers?.agentganggang?.command !== 'npm') {
  findings.push('Claude starter kit must launch AgentGangGang with npm.');
}

const openCodeKit = JSON.parse(
  stripJsonComments(read('mcp/integration-kits/opencode.jsonc.example'))
);
if (openCodeKit?.mcp?.agentganggang?.type !== 'local') {
  findings.push('OpenCode starter kit must declare a local MCP server.');
}
if (!Array.isArray(openCodeKit?.mcp?.agentganggang?.command)) {
  findings.push('OpenCode starter kit must keep the command as an array.');
}

const openClawJson = JSON.parse(
  read('mcp/integration-kits/openclaw.agentganggang.json.example')
);
if (openClawJson?.command !== 'npm') {
  findings.push('OpenClaw starter JSON must launch AgentGangGang through npm.');
}
if (!Array.isArray(openClawJson?.args) || openClawJson.args.length === 0) {
  findings.push('OpenClaw starter JSON must include command args.');
}
if (!openClawJson.args.includes('mcp:server')) {
  findings.push('OpenClaw starter JSON must still target npm run mcp:server.');
}

const openClawShell = read('mcp/integration-kits/openclaw.mcp.set.example.sh');
if (!openClawShell.includes('openclaw mcp set agentganggang')) {
  findings.push('OpenClaw shell helper must show the exact registry command.');
}
if (!openClawShell.includes('\\"command\\": \\"npm\\"')) {
  findings.push('OpenClaw shell helper must stay aligned with the npm-based JSON payload.');
}

const kitsReadme = read('mcp/integration-kits/README.md');
for (const relPath of [
  'codex.config.toml.example',
  'claude.mcp.json.example',
  'opencode.jsonc.example',
  'openclaw.agentganggang.json.example',
  'openclaw.mcp.servers.json.example',
  'openclaw.mcp.set.example.sh',
]) {
  if (!kitsReadme.includes(relPath)) {
    findings.push(`Integration kits README is missing ${relPath}.`);
  }
}

const supportMatrix = JSON.parse(read('mcp/integration-kits/support-matrix.json'));
const publicDistributionMatrix = JSON.parse(
  read('mcp/integration-kits/public-distribution-matrix.json')
);
if (supportMatrix?.path_placeholder !== PATH_PLACEHOLDER) {
  findings.push('Support matrix must expose the shared path_placeholder.');
}
for (const host of ['codex', 'claude_code', 'opencode', 'openclaw']) {
  if (!supportMatrix?.hosts?.[host]) {
    findings.push(`Support matrix must expose hosts.${host}.`);
  }
  if (typeof supportMatrix?.hosts?.[host]?.placement_hint !== 'string') {
    findings.push(`Support matrix must expose hosts.${host}.placement_hint.`);
  }
  if (typeof supportMatrix?.hosts?.[host]?.public_bundle_dir !== 'string') {
    findings.push(`Support matrix must expose hosts.${host}.public_bundle_dir.`);
  }
}
if (!Array.isArray(supportMatrix?.public_bundle_ready_unverified_host_lane)) {
  findings.push('Support matrix must expose public_bundle_ready_unverified_host_lane.');
}
for (const host of ['codex', 'claude_code', 'opencode', 'openclaw']) {
  if (!publicDistributionMatrix?.hosts?.[host]) {
    findings.push(`Public distribution matrix must expose hosts.${host}.`);
  }
  if (!Array.isArray(publicDistributionMatrix?.hosts?.[host]?.public_bundle_assets)) {
    findings.push(`Public distribution matrix must expose hosts.${host}.public_bundle_assets.`);
  }
  if (typeof publicDistributionMatrix?.hosts?.[host]?.truthful_claim !== 'string') {
    findings.push(`Public distribution matrix must expose hosts.${host}.truthful_claim.`);
  }
}
if (
  !Array.isArray(supportMatrix?.workflow_followthrough) ||
  !supportMatrix.workflow_followthrough.includes('agentganggang.get_workflow_run') ||
  !supportMatrix.workflow_followthrough.includes('agentganggang.list_workflow_runs') ||
  !supportMatrix.workflow_followthrough.includes('agentganggang.resume_workflow')
) {
  findings.push(
    'Support matrix must expose the workflow_followthrough sequence for get/list/resume.'
  );
}

const starterKitsDoc = read('docs/mcp-starter-kits.html');
const publicDistributionDoc = read('docs/public-distribution-matrix.html');
const hostPacketsDoc = read('docs/mcp-host-packets.html');
if (!starterKitsDoc.includes(PATH_PLACEHOLDER)) {
  findings.push('Starter kits page must use the shared placeholder path.');
}
for (const needle of ['Codex', 'Claude Code', 'OpenCode', 'OpenClaw']) {
  if (!starterKitsDoc.includes(needle)) {
    findings.push(`Starter kits page is missing ${needle}.`);
  }
}
for (const needle of [
  'agentganggang://builder/support-matrix',
  'agentganggang://sites/capabilities',
  'Smallest useful compare-first loop',
]) {
  if (!starterKitsDoc.includes(needle)) {
    findings.push(`Starter kits page must mention ${needle}.`);
  }
}
for (const needle of [
  'AgentGangGang public distribution matrix',
  'official marketplace or registry',
  'Public-bundle-ready packet available now.',
  'npm run release:host-kits',
  'https://docs.openclaw.ai/plugins',
]) {
  if (!publicDistributionDoc.includes(needle)) {
    findings.push(`Public distribution page must mention ${needle}.`);
  }
}
for (const needle of [
  'AgentGangGang host packets',
  'Codex packet',
  'Claude Code packet',
  'OpenCode packet',
  'OpenClaw packet',
]) {
  if (!hostPacketsDoc.includes(needle)) {
    findings.push(`Host packets page must mention ${needle}.`);
  }
}

const packageJson = JSON.parse(read('package.json'));
if (packageJson?.scripts?.['release:host-kits'] !== 'node scripts/release/build-host-kit-bundles.mjs') {
  findings.push('package.json must expose release:host-kits.');
}

const readme = read('README.md');
for (const needle of [
  'agentganggang://builder/support-matrix',
  'agentganggang://sites/capabilities',
  'Quick placement map',
  'public-distribution-matrix.html',
  'mcp-host-packets.html',
]) {
  if (!readme.includes(needle)) {
    findings.push(`README must mention ${needle}.`);
  }
}

const faqDoc = read('docs/faq.html');
if (!faqDoc.includes('Where do the MCP starter files go for Codex, Claude Code, OpenCode, and OpenClaw?')) {
  findings.push('FAQ must explain where MCP starter files go for the documented hosts.');
}
if (!faqDoc.includes('Is AgentGangGang already listed on an official marketplace or registry for every documented host?')) {
  findings.push('FAQ must explain official marketplace and registry truth for the documented hosts.');
}
if (!faqDoc.includes('mcp-host-packets.html')) {
  findings.push('FAQ must link to the host packets page.');
}

for (const relPath of [
  'mcp/integration-kits/codex.skill.agentganggang.md.example',
  'mcp/integration-kits/claude.skill.agentganggang.md.example',
  'mcp/integration-kits/opencode.skill.agentganggang.md.example',
  'mcp/integration-kits/openclaw.skill.agentganggang.md.example',
]) {
  const text = read(relPath);
  if (!text.includes('agentganggang.bridge_status')) {
    findings.push(`${relPath} must keep the bridge_status-first flow.`);
  }
  if (!text.includes('## Smallest useful flow')) {
    findings.push(`${relPath} must document the smallest useful flow.`);
  }
  if (!text.includes('## Preferred full flow')) {
    findings.push(`${relPath} must document the preferred full flow.`);
  }
  for (const required of [
    'agentganggang.get_workflow_run',
    'agentganggang.list_workflow_runs',
    'agentganggang.resume_workflow',
  ]) {
    if (!text.includes(required)) {
      findings.push(`${relPath} must include ${required} in the workflow follow-through flow.`);
    }
  }
}

for (const relPath of [
  'mcp/integration-kits/codex.config.toml.example',
  'mcp/integration-kits/claude.mcp.json.example',
  'mcp/integration-kits/opencode.jsonc.example',
  'mcp/integration-kits/openclaw.agentganggang.json.example',
  'mcp/integration-kits/openclaw.mcp.servers.json.example',
  'mcp/integration-kits/openclaw.mcp.set.example.sh',
  'mcp/integration-kits/public-bundles/codex-bundle/package.json',
  'mcp/integration-kits/public-bundles/claude-code-bundle/package.json',
  'mcp/integration-kits/public-bundles/opencode-plugin/package.json',
  'mcp/integration-kits/public-bundles/openclaw-bundle/package.json',
  'mcp/integration-kits/public-distribution-matrix.json',
  'docs/mcp-host-packets.html',
  'docs/codex-mcp-setup.html',
  'docs/claude-code-mcp-setup.html',
  'docs/opencode-mcp-setup.html',
  'docs/openclaw-mcp-setup.html',
  'docs/mcp-starter-kits.html',
  'docs/public-distribution-matrix.html',
]) {
  const text = read(relPath);
  if (FORBIDDEN_LOCAL_PATH_PATTERNS.some((pattern) => text.includes(pattern))) {
    findings.push(`${relPath} must not expose a real local absolute path.`);
  }
}

if (findings.length > 0) {
  console.error('[integration-kits] failed:');
  for (const finding of findings) {
    console.error(`- ${finding}`);
  }
  process.exit(1);
}

console.log(
  '[integration-kits] passed: starter kits and quickstart packets stay internally consistent'
);
