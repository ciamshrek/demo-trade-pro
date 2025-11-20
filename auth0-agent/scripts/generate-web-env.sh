#!/usr/bin/env bash
# Generate .env for the DemoTradePro Agent using Terraform outputs

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
AUTH0_DIR="$(dirname "$SCRIPT_DIR")"
AGENT_APP_DIR="$AUTH0_DIR/../apps/agent"
WEB_ENV_FILE="$AGENT_APP_DIR/.env"

# Source shared configuration
source "$AUTH0_DIR/config.sh"

# Ensure the agent app directory exists
if [ ! -d "$AGENT_APP_DIR" ]; then
  echo "Error: Agent app directory not found at $AGENT_APP_DIR"
  exit 1
fi

# Check if terraform outputs are available
if [ ! -f "$AUTH0_DIR/terraform/terraform.tfstate" ]; then
  echo "Error: terraform.tfstate not found. Please run 'terraform apply' first in the auth0/terraform directory."
  exit 1
fi

echo "Generating .env for DemoTradePro Agent app from Terraform outputs..."

# Change to terraform directory to run terraform commands
cd "$AUTH0_DIR/terraform"

# Generate a random AUTH0_SECRET if not provided
AUTH0_SECRET=$(openssl rand -hex 32)

# Extract values from terraform output
AGENT_CLIENT_ID=$(terraform output -raw agent_client_id)
AGENT_CLIENT_SECRET=$(terraform output -raw agent_client_secret)
AUTH0_DOMAIN=$(terraform output -raw auth0_domain)
AUTH0_ISSUER_BASE_URL=$(terraform output -raw auth0_issuer_base_url)
MCP_CLIENT_ID=$(terraform output -raw mcp_client_id)
MCP_CLIENT_SECRET=$(terraform output -raw mcp_client_secret)

# For the stock trading workshop, we'll use the standard client secret approach
# Remove JWE complexity for now

# Write .env file for the agent app
cat > "$WEB_ENV_FILE" <<EOF
AUTH0_DOMAIN=$AUTH0_DOMAIN
AUTH0_CLIENT_ID=$AGENT_CLIENT_ID
AUTH0_CLIENT_SECRET=$AGENT_CLIENT_SECRET
AUTH0_SECRET=$AUTH0_SECRET
APP_BASE_URL=$AGENT_BASE_URL
AUTH0_BASE_URL=$AGENT_BASE_URL
AUTH0_ISSUER_BASE_URL=$AUTH0_ISSUER_BASE_URL

# MCP Server
AUTH0_AUDIENCE=$AGENT_MCP_RESOURCE_IDENTIFIER
MCP_SERVER_URL=$AGENT_MCP_SERVER_URL
MCP_SERVER_CUSTOM_API_CLIENT_ID=$MCP_CLIENT_ID
MCP_SERVER_CUSTOM_API_CLIENT_SECRET=$MCP_CLIENT_SECRET
# Redis for MCP session management
REDIS_URL=redis://localhost:6379

# OpenAI Configuration for AI Agent
# TODO: Replace with your actual OpenAI API key
OPENAI_API_KEY=your_openai_api_key_here

# Upstream DemoTradePro API Configuration (from root tenant)
API_BASE_URL=https://workshop-stock-api.auth101.dev/api
API_AUDIENCE=https://api.stocktrade.example
API_OIDC_CONNECTION_NAME=demotradepro-oidc

# Agent will authenticate users and request tokens with these scopes on the upstream API
API_DEFAULT_SCOPES="openid profile email offline_access trade:read trade:write portfolio:read"
EOF

echo ".env written to $WEB_ENV_FILE"
echo ""
echo "✅ Environment variables configured for DemoTradePro Agent:"
echo "  - AUTH0_DOMAIN: $AUTH0_DOMAIN"
echo "  - AUTH0_CLIENT_ID: $AGENT_CLIENT_ID"
echo "  - AUTH0_BASE_URL: $AGENT_BASE_URL"
echo "  - UPSTREAM_API: http://localhost:3001/api/"
echo ""
echo "🔐 Authentication Method: Standard client_secret (Auth0 Next.js SDK v4.9+)"
echo "🤖 Agent connects to upstream DemoTradePro API from root tenant"
echo ""
echo "⚠️  IMPORTANT: Add your OpenAI API Key!"
echo "   Edit $WEB_ENV_FILE and replace 'your_openai_api_key_here' with your actual OpenAI API key"
echo "   You can get one from: https://platform.openai.com/api-keys"
echo ""
echo "🚀 After adding your OpenAI key, start the agent with: cd ../apps/agent && pnpm dev"
echo ""
