#!/usr/bin/env bash
# DemoTradePro Agent Auth0 Initial Setup Script
# Run this once to set up the Agent tenant Auth0 configuration from scratch

set -euo pipefail

echo "🤖 DemoTradePro Agent Auth0 Initial Setup"
echo "======================================="

# Get the script directory
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

echo ""
echo "Step 1: Generate Auth0 Management Client..."
echo "-------------------------------------------"
cd scripts
./generate-auth-management-client.sh

echo ""
echo "Step 2: Initialize Terraform..."
echo "------------------------------"
cd ../terraform
terraform init

echo ""
echo "Step 3: Apply Terraform Configuration..."
echo "---------------------------------------"
terraform apply -auto-approve

echo ""
echo "Step 4: Generate Agent Environment File..."
echo "------------------------------------------"
cd ../scripts
echo "Generating Agent App environment..."
./generate-web-env.sh



echo ""
echo "✅ DemoTradePro Agent Auth0 Setup Complete!"
echo "=========================================="
echo ""
echo "Next Steps:"
echo "1. Start the agent app: cd ../apps/agent && pnpm dev"
echo "2. Visit http://localhost:3003 to test agent authentication"
echo "3. Agent will connect to upstream DemoTradePro API (root tenant)"
echo ""
echo "📝 To make changes to Auth0 config, edit the .tf files and run:"
echo "   ./update.sh"
echo ""
