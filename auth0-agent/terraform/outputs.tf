output "agent_client_id" {
  value = auth0_client.demotradepro_agent.client_id
  description = "Auth0 Client ID for the DemoTradePro Agent application"
}

# Data source to retrieve the client secret
data "auth0_client" "demotradepro_agent_data" {
  client_id = auth0_client.demotradepro_agent.client_id
}

output "agent_client_secret" {
  value = data.auth0_client.demotradepro_agent_data.client_secret
  description = "Auth0 Client Secret for the DemoTradePro Agent application"
  sensitive = true
}

output "auth0_domain" {
  value = var.auth0_domain
  description = "Auth0 domain"
}

output "auth0_issuer_base_url" {
  value = "https://${var.auth0_domain}"
  description = "Auth0 issuer base URL"
}

# MCP Server Outputs
output "mcp_client_id" {
  value = restapi_object.mcp_server_client.id
  description = "Auth0 Client ID for the MCP Server (created via REST API)"
}

# Data source to retrieve the MCP client secret
data "auth0_client" "mcp_server_client_data" {
  client_id = restapi_object.mcp_server_client.id
}

output "mcp_client_secret" {
  value = data.auth0_client.mcp_server_client_data.client_secret
  description = "Auth0 Client Secret for the MCP Server"
  sensitive = true
}

output "mcp_audience" {
  value = auth0_resource_server.mcp_server.identifier
  description = "Auth0 audience for the MCP server"
}

output "mcp_server_url" {
  value = var.agent_base_url
  description = "MCP server URL for development"
}

output "auth0_tenant" {
  value = split(".", var.auth0_domain)[0]
  description = "Auth0 tenant name"
}