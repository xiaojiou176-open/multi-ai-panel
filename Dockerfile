FROM node:22-bookworm-slim

WORKDIR /app

LABEL org.opencontainers.image.title="AgentGangGang MCP Sidecar"
LABEL org.opencontainers.image.description="Containerized local AgentGangGang MCP sidecar and operator helper."
LABEL org.opencontainers.image.source="https://github.com/xiaojiou176-open/AgentGangGang"
LABEL org.opencontainers.image.licenses="MIT"
LABEL io.modelcontextprotocol.server.name="io.github.xiaojiou176-open/agentganggang"

COPY package.json package-lock.json* ./
RUN if [ -f package-lock.json ]; then npm ci --ignore-scripts; else npm install --ignore-scripts; fi

COPY . .

RUN chown -R node:node /app

ENV AGENTGANGGANG_BRIDGE_HOST=0.0.0.0
ENV AGENTGANGGANG_BRIDGE_PORT=48123

EXPOSE 48123

HEALTHCHECK --interval=30s --timeout=5s --retries=3 CMD ["node", "docker/healthcheck.mjs"]

USER node

ENTRYPOINT ["node", "docker/entrypoint.mjs"]
CMD ["server"]
