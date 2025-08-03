# MCP (Model Context Protocol) Resource Server Configuration
# 
# This file defines the Auth0 resource server for the DemoTradePro MCP Server.
# The MCP server allows AI agents to securely access trading tools with proper
# authentication and authorization.
#
# To enable MCP functionality:
# 1. Uncomment all resources below (remove the "# " prefix from each line)
# 2. Run: terraform apply
# 3. Run: ./scripts/generate-mcp-env.sh
# 4. Start the MCP server: cd ../../apps/mcp-server && pnpm dev

# resource "auth0_resource_server" "mcp_server" {
#   name         = "${var.project_name} MCP Server"
#   identifier   = "http://localhost:3004"
#   signing_alg  = "RS256"
# 
#   # Enable RBAC to use scopes
#   allow_offline_access = true
#   token_lifetime       = 86400
#   skip_consent_for_verifiable_first_party_clients = true
# }
# 
# # Define individual scopes using separate resources
# resource "auth0_resource_server_scope" "mcp_trade_read" {
#   resource_server_identifier = auth0_resource_server.mcp_server.identifier
#   scope                      = "trade:read"
#   description               = "View orders and trading information via MCP"
# }
# 
# resource "auth0_resource_server_scope" "mcp_trade_write" {
#   resource_server_identifier = auth0_resource_server.mcp_server.identifier
#   scope                      = "trade:write"
#   description               = "Create and manage orders via MCP"
# }
# 
# resource "auth0_resource_server_scope" "mcp_portfolio_read" {
#   resource_server_identifier = auth0_resource_server.mcp_server.identifier
#   scope                      = "portfolio:read"
#   description               = "View portfolio information via MCP"
# }
