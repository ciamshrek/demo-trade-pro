# =============================================================================
# OIDC CONNECTION TO SOURCE TENANT (Workshop Setup)
# =============================================================================
# This file creates an OIDC connection from the agent tenant to the source DemoTradePro tenant
# 
# TO ENABLE:
# 1. Uncomment the variables in variables.tf  
# 2. Uncomment the resources below
# 3. Get source tenant credentials from /developer route
# 4. Add values to terraform.tfvars
# 5. Run: terraform apply

# OIDC Connection Resource
# resource "auth0_connection" "demotradepro_oidc" {
#   name           = var.oidc_connection_name
#   display_name   = "DemoTradePro OIDC"
#   strategy       = "oidc"
#   enabled_clients = [auth0_client.demotradepro_agent.client_id]
# 
#   options {
#     type                = "back_channel"
#     issuer             = "https://${var.source_tenant_domain}/"
#     jwks_uri           = "https://${var.source_tenant_domain}/.well-known/jwks.json"
#     discovery_url      = "https://${var.source_tenant_domain}/.well-known/openid_configuration"
#     token_endpoint     = "https://${var.source_tenant_domain}/oauth/token"
#     userinfo_endpoint  = "https://${var.source_tenant_domain}/userinfo"
#     authorization_endpoint = "https://${var.source_tenant_domain}/authorize"
#     client_id          = var.source_client_id
#     client_secret      = var.source_client_secret
#     
#     # Standard OIDC scopes
#     scope = "openid profile email trade:read trade:write portfolio:read offline_access"
#     
#     # Schema and connection settings
#     schema_version = "oidc-V4"
#     attribute_map = {
#       mapping_mode = "bind_all"
#     }
#     connection_settings = {
#       pkce = "auto"
#     }
#     
#     # TOKEN VAULT CONFIGURATION 🔐
#     # This enables secure token exchange for AI agents
#     federated_connections_access_tokens = {
#       active = true
#     }
#     
#     # API audience for token exchange
#     upstream_params = {
#       audience = {
#         value = var.api_audience
#       }
#     }
#   }
# }

# Output the connection details for reference
# output "oidc_connection_id" {
#   description = "ID of the OIDC connection"
#   value       = auth0_connection.demotradepro_oidc.id
# }
# 
# output "oidc_connection_name" {
#   description = "Name of the OIDC connection"
#   value       = auth0_connection.demotradepro_oidc.name
# }
