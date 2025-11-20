# Auth0 Tenant Configuration
# Configures tenant-wide settings including dynamic client registration

# Add delay to avoid rate limiting - update tenant after all scopes are created
resource "time_sleep" "wait_before_tenant_update" {
  depends_on = [auth0_resource_server_scope.mcp_portfolio_read]
  
  create_duration = "3s"
}

resource "auth0_tenant" "main" {
  # Ensure all MCP resources are created before updating tenant settings
  depends_on = [time_sleep.wait_before_tenant_update]
  
  # Dynamic Client Registration
  # This allows MCP clients and other services to register themselves dynamically
  flags {
    enable_dynamic_client_registration = true
  }
  
  # Security settings
  default_audience = var.mcp_resource_identifier
  default_directory = "Username-Password-Authentication"
  
  # Session and token settings
  session_lifetime = 720  # 12 hours
  idle_session_lifetime = 72  # 72 hours
}