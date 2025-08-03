resource "auth0_client" "demotradepro_agent" {
  name            = "${var.project_name}"
  app_type        = "regular_web"
  is_first_party  = true

  callbacks       = [var.agent_callback_url]
  allowed_logout_urls = [var.agent_base_url]
  web_origins     = [var.agent_base_url]
  allowed_origins = [var.agent_base_url]
  
  oidc_conformant = true

  jwt_configuration {
    alg = "RS256"
  }

  grant_types = [
    "authorization_code", 
    "refresh_token"
  ]
}

# Note: Agent doesn't need API grants in this tenant
# Agent will handle user authentication and forward tokens to external services
