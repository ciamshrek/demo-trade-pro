# Resource Server Compatibility Layer
#
# This file contains workarounds for Auth0 Terraform provider limitations.
# Uses terraform-provider-restapi for proper HTTP resource management.
# Should be removed once Auth0 Terraform supports all Management API v2 fields.

# Add delay to avoid rate limiting - wait for all scopes to be created first
resource "time_sleep" "wait_before_mcp_client" {
  depends_on = [auth0_resource_server_scope.mcp_portfolio_read]
  
  create_duration = "3s"
}

# Create Auth0 client with resource_server_identifier using REST API
# This replaces the limited Auth0 Terraform provider with full Management API access
resource "restapi_object" "mcp_server_client" {
  depends_on = [time_sleep.wait_before_mcp_client]
  
  provider = restapi
  path     = "/clients"
  
  # Standard CRUD operations
  create_method = "POST"
  read_method   = "GET"
  update_method = "PATCH"
  destroy_method = "DELETE"
  
  # Create the complete client with all necessary fields
  data = jsonencode({
    name                       = "${var.project_name} MCP Server"
    app_type                   = "resource_server"
    oidc_conformant           = true
    resource_server_identifier = auth0_resource_server.mcp_server.identifier
    
    # JWT configuration
    jwt_configuration = {
      alg = "RS256"
    }
    
    # Grant types for token exchange
    grant_types = [
      "urn:auth0:params:oauth:grant-type:token-exchange:federated-connection-access-token"
    ]    
  })
  
  # Only send managed fields on updates to prevent unwanted diffs
  update_data = jsonencode({
    name                       = "${var.project_name} MCP Server"
    app_type                   = "resource_server"
    resource_server_identifier = auth0_resource_server.mcp_server.identifier
  })
  
  ignore_all_server_changes = true 
  
  # The API will return the client_id in the response
  id_attribute = "client_id"
}