#!/bin/bash

# =============================================================================
# Add OIDC Connection to Agent Tenant
# =============================================================================
# This script enables OIDC connection from agent tenant to source DemoTradePro tenant
# Prerequisites: terraform.tfvars should contain OIDC connection values

set -e

echo "🔧 Setting up OIDC Connection..."

# Check if we're in the right directory
if [[ ! -f "terraform/variables.tf" ]]; then
    echo "❌ Error: Must run from auth0-agent directory (terraform/variables.tf not found)"
    exit 1
fi

cd terraform

echo "📝 Step 1: Uncomment OIDC variables in variables.tf..."

# Uncomment the OIDC variables
sed -i.bak 's/^# variable "source_tenant_domain"/variable "source_tenant_domain"/' variables.tf
sed -i.bak 's/^# variable "source_client_id"/variable "source_client_id"/' variables.tf  
sed -i.bak 's/^# variable "source_client_secret"/variable "source_client_secret"/' variables.tf
sed -i.bak 's/^# variable "oidc_connection_name"/variable "oidc_connection_name"/' variables.tf
sed -i.bak 's/^# variable "api_audience"/variable "api_audience"/' variables.tf

# Also uncomment the variable blocks (lines that start with # followed by space and closing brace, etc.)
sed -i.bak 's/^#   /  /' variables.tf
sed -i.bak 's/^# }/}/' variables.tf

echo "📝 Step 2: Uncomment OIDC resources in connection__oidc_source.tf..."

# Uncomment the resource definitions
sed -i.bak 's/^# resource/resource/' connection__oidc_source.tf
sed -i.bak 's/^# output/output/' connection__oidc_source.tf
sed -i.bak 's/^#   /  /' connection__oidc_source.tf
sed -i.bak 's/^# }/}/' connection__oidc_source.tf

echo "🔍 Step 3: Checking terraform.tfvars for required values..."

# Check if required OIDC variables exist in terraform.tfvars
required_vars=("source_tenant_domain" "source_client_id" "source_client_secret")
missing_vars=()

for var in "${required_vars[@]}"; do
    if ! grep -q "^${var}" terraform.tfvars; then
        missing_vars+=("$var")
    fi
done

if [ ${#missing_vars[@]} -ne 0 ]; then
    echo "❌ Missing required variables in terraform.tfvars:"
    printf "   - %s\n" "${missing_vars[@]}"
    echo ""
    echo "💡 Get these values from the /developer route in the DemoTradePro web app"
    echo "   Then add them to terraform.tfvars like:"
    echo ""
    echo "   source_tenant_domain = \"your-source-tenant.us.auth0.com\""
    echo "   source_client_id = \"your_client_id\""
    echo "   source_client_secret = \"your_client_secret\""
    echo ""
    exit 1
fi

echo "✅ terraform.tfvars contains required OIDC variables"

echo "🚀 Step 4: Applying Terraform configuration..."

# Initialize and apply
terraform init
terraform apply -auto-approve

echo ""
echo "🎉 OIDC Connection setup complete!"
echo ""
echo "📋 Next steps:"
echo "   1. Update your agent's Auth0 configuration to use the OIDC connection"
echo "   2. Test authentication flow in your agent application"
echo "   3. The agent can now use Token Vault for secure API access"
echo ""
echo "🔍 Connection details:"
terraform output -json | jq -r '
if .oidc_connection_id then 
  "   Connection ID: " + .oidc_connection_id.value 
else 
  "   (Connection details available after next terraform refresh)"
end'
