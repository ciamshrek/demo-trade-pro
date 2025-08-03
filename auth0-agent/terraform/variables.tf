variable "auth0_domain" {}
variable "auth0_client_id" {}
variable "auth0_client_secret" {
    sensitive = true
}

variable "project_name" {
  description = "Name of the project (used for resource naming)"
  type        = string
  default     = "DemoTradePro Agent"
}

# DemoTradePro Agent Application URLs
variable "agent_base_url" {
  description = "Base URL for the DemoTradePro Agent application"
  type        = string
  default     = "http://localhost:3003"
}

variable "agent_callback_url" {
  description = "Auth callback URL for the DemoTradePro Agent application"
  type        = string  
  default     = "http://localhost:3003/auth/callback"
}

# Note: Agent tenant is simplified - no API server needed
# Agent will authenticate users and make calls to external services

# =============================================================================
# OIDC CONNECTION VARIABLES (Workshop Setup)
# =============================================================================
# Uncomment these variables when setting up OIDC connection to source tenant
# The /developer route in the main DemoTradePro app will generate values for these

# variable "source_tenant_domain" {
#   description = "Domain of the source Auth0 tenant (DemoTradePro)"
#   type        = string
#   # Example: "your-source-tenant.us.auth0.com"
# }

# variable "source_client_id" {
#   description = "Client ID from the source tenant for OIDC connection"
#   type        = string
# }

# variable "source_client_secret" {
#   description = "Client secret from the source tenant for OIDC connection"
#   type        = string
#   sensitive   = true
# }

# variable "oidc_connection_name" {
#   description = "Name for the OIDC connection"
#   type        = string
#   default     = "demotradepro-oidc"
# }

# variable "api_audience" {
#   description = "API audience for token vault (should match source tenant API)"
#   type        = string
#   default     = "https://api.demotradepro.example"
# }