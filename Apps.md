# Workshop Applications

## Services Overview

## Services Overview

| Service                         | Port | Technology       | Purpose                  | Start Command                    |
| ------------------------------- | ---- | ---------------- | ------------------------ | -------------------------------- |
| DemoTradePro Web                | 3000 | Next.js          | Main trading application | `cd apps/web && pnpm dev`        |
| DemoTradePro API                | 3001 | Hono             | REST API server          | `cd apps/api-server && pnpm dev` |
| Workshop Docs                   | 3002 | Next.js          | Documentation site       | `cd apps/docs && pnpm dev`       |
| DemoTradePro Agent & MCP Server | 3003 | Next.js (Vercel) | AI trading agent         | `cd apps/agent && pnpm dev`      |

## Quick Start

```bash
# Set Node version
nvm use --lts

# Install dependencies
pnpm install

# Start all services (run each in separate terminal)
cd apps/web && pnpm dev          # :3000
cd apps/api-server && pnpm start   # :3001
cd apps/docs && pnpm dev         # :3002
cd apps/agent && pnpm dev        # :3003
```

## Auth0 Setup Note

Auth0 requires HTTPS for secure contexts. For workshop demos, consider using a local HTTPS proxy to route all services through a single domain
.
