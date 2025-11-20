# MCP (Model Context Protocol) Resource Server Configuration
# 
# This file defines the Auth0 resource server for the AI Agent MCP Server.
# this allows our "agentic capabilities" to be used by any MCP Client like Claude 
# 
# To enable MCP functionality:
# 1. Uncomment all resources below (remove the "# " prefix from each line)
# 2. Run: terraform apply
# 3. Run: ./scripts/generate-mcp-env.sh
# 4. Start the MCP server: cd ../../apps/mcp-server && pnpm dev

resource "auth0_resource_server" "mcp_server" {
   name         = "${var.project_name} MCP Server"
   identifier   = var.mcp_resource_identifier
   signing_alg  = "RS256"
 
  # Enable RBAC to use scopes
  allow_offline_access = true
  token_lifetime       = 86400
  skip_consent_for_verifiable_first_party_clients = true

  authorization_details {
    type = "urn:auth0:schemas:authorization-details:v1:create_order"
  }
}

# Add delay to avoid rate limiting
resource "time_sleep" "wait_after_resource_server" {
  depends_on = [auth0_resource_server.mcp_server]
  
  create_duration = "3s"
}

# Define individual scopes using separate resources
resource "auth0_resource_server_scope" "mcp_trade_read" {
  depends_on = [time_sleep.wait_after_resource_server]
  resource_server_identifier = auth0_resource_server.mcp_server.identifier
  scope                      = "trade:read"
  description               = "View orders and trading information via MCP"
}

resource "auth0_resource_server_scope" "mcp_trade_write" {
  depends_on = [auth0_resource_server_scope.mcp_trade_read]
  resource_server_identifier = auth0_resource_server.mcp_server.identifier
  scope                      = "trade:write"
  description               = "Create and manage orders via MCP"
}

# Note: Client patching for resource_server_identifier is handled in:
# resource__mcp_server--compat.tf

resource "auth0_resource_server_scope" "mcp_portfolio_read" {
  depends_on = [auth0_resource_server_scope.mcp_trade_write]
  resource_server_identifier = auth0_resource_server.mcp_server.identifier
  scope                      = "portfolio:read"
  description               = "View portfolio information via MCP"
}

# Note: MCP Server client is now created via REST API in resource__mcp_server--compat.tf
# This provides full Management API access including resource_server_identifier field