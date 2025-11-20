# OIDC Connection Resource
# Add delay to avoid rate limiting - create connection after agent client is created
resource "time_sleep" "wait_before_connection" {
  depends_on = [auth0_client.demotradepro_agent]
  
  create_duration = "3s"
}

resource "auth0_connection" "demotradepro_oidc" {
   depends_on = [time_sleep.wait_before_connection]
   
   name           = var.oidc_connection_name
   display_name   = "DemoTradePro OIDC"
   strategy       = "oidc"
   is_domain_connection = true

   options {
        type                = "back_channel"
        issuer             = "https://${var.source_tenant_domain}/"
        jwks_uri           = "https://${var.source_tenant_domain}/.well-known/jwks.json"
        discovery_url      = "https://${var.source_tenant_domain}/.well-known/openid_configuration"
        token_endpoint     = "https://${var.source_tenant_domain}/oauth/token"
        userinfo_endpoint  = "https://${var.source_tenant_domain}/userinfo"
        authorization_endpoint = "https://${var.source_tenant_domain}/authorize"
        client_id          = var.source_client_id
        client_secret      = var.source_client_secret
        
        # Standard OIDC scopes
        scopes = ["openid", "profile", "email", "trade:read", "trade:write", "portfolio:read", "offline_access"]

        # API audience for token exchange - simplified for Auth0 provider
        upstream_params = jsonencode({
            audience = {
                value = var.api_audience
            }
        })
   }
}

# Add delay to avoid rate limiting
resource "time_sleep" "wait_after_connection" {
  depends_on = [auth0_connection.demotradepro_oidc]
  
  create_duration = "3s"
}

# Enable the connection for the agent client and the mcp custom api client
resource "auth0_connection_clients" "demotradepro_oidc_clients" {
   depends_on = [time_sleep.wait_after_connection, restapi_object.mcp_server_client]
   connection_id = auth0_connection.demotradepro_oidc.id
   enabled_clients = [auth0_client.demotradepro_agent.client_id, restapi_object.mcp_server_client.id]
}

# Output the connection details for reference
output "oidc_connection_id" {
  description = "ID of the OIDC connection"
  value       = auth0_connection.demotradepro_oidc.id
}

output "oidc_connection_name" {
  description = "Name of the OIDC connection"
  value       = auth0_connection.demotradepro_oidc.name
}