#!/usr/bin/env bash
# Enable MCP functionality for DemoTradePro Agent
#
# Prerequisites:
# 1. Basic agent setup completed (run ./init.sh first)
# 2. MCP resources uncommented in terraform files:
#    - terraform/resource__mcp_server.tf
#    - terraform/outputs.tf (MCP sections)
#
# This script will:
# 1. Apply terraform changes to create MCP resource server
# 2. Generate environment file for the MCP server

set -euo pipefail

echo "🚀 Enabling MCP functionality for DemoTradePro Agent..."

# Apply terraform changes
echo "📋 Applying terraform changes..."
cd terraform && terraform apply

# Generate MCP environment file
echo "📝 Generating MCP server environment file..."
cd .. && ./scripts/generate-mcp-env.sh

echo "✅ MCP functionality enabled!"
echo ""
echo "Next steps:"
echo "1. Start the MCP server: cd ../../apps/mcp-server && pnpm dev"
echo "2. The MCP server will be available at: http://localhost:3004/mcp"
echo "3. Health check: http://localhost:3004/ping"
