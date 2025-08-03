#!/usr/bin/env bash
# Generate .env for the MCP server using Terraform outputs

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
AUTH0_DIR="$(dirname "$SCRIPT_DIR")"
MCP_SERVER_DIR="$AUTH0_DIR/../apps/mcp-server"
MCP_ENV_FILE="$MCP_SERVER_DIR/.env"

# Ensure the MCP server directory exists
if [ ! -d "$MCP_SERVER_DIR" ]; then
  echo "Error: MCP server directory not found at $MCP_SERVER_DIR"
  exit 1
fi

# Check if terraform outputs are available
if [ ! -f "$AUTH0_DIR/terraform/terraform.tfstate" ]; then
  echo "Error: terraform.tfstate not found. Please run 'terraform apply' first in the auth0-agent/terraform directory."
  exit 1
fi

echo "Generating .env for DemoTradePro MCP Server from Terraform outputs..."

# Change to terraform directory to run terraform commands
cd "$AUTH0_DIR/terraform"

# Extract values from terraform output
AUTH0_DOMAIN=$(terraform output -raw auth0_domain)
AUTH0_TENANT=$(terraform output -raw auth0_tenant)
MCP_AUDIENCE=$(terraform output -raw mcp_audience)
MCP_SERVER_URL=$(terraform output -raw mcp_server_url)

# Write .env file for the MCP server
cat > "$MCP_ENV_FILE" <<EOF
# Auth0 Configuration for DemoTradePro MCP Server
AUTH0_DOMAIN=$AUTH0_DOMAIN
AUTH0_TENANT=$AUTH0_TENANT

# MCP Server Configuration
MCP_AUDIENCE=$MCP_AUDIENCE
MCP_SERVER_URL=$MCP_SERVER_URL
NODE_ENV=development

# The MCP server uses the Auth0 domain and tenant to validate JWTs
# and the MCP_AUDIENCE to ensure tokens are intended for this resource server
EOF

echo ".env written to $MCP_ENV_FILE"
echo ""
echo "✅ Environment variables configured for DemoTradePro MCP Server:"
echo "  - AUTH0_DOMAIN: $AUTH0_DOMAIN"
echo "  - AUTH0_TENANT: $AUTH0_TENANT"
echo "  - MCP_AUDIENCE: $MCP_AUDIENCE"
echo "  - MCP_SERVER_URL: $MCP_SERVER_URL"
echo ""
echo "🔧 MCP Server Tools Available:"
echo "  - get_portfolio (scope: portfolio:read)"
echo "  - get_stocks (scope: trade:read)"
echo "  - create_order (scope: trade:write)"
echo ""
echo "🚀 Start the MCP server with: cd ../../apps/mcp-server && pnpm dev"
echo "🔗 MCP endpoint will be available at: $MCP_SERVER_URL/mcp"
echo "🔍 Health check: $MCP_SERVER_URL/ping"
echo ""
