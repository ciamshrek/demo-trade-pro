#!/usr/bin/env bash
# DemoTradePro Agent Auth0 Update Script
# Run this to apply Terraform changes and regenerate agent environment file

set -euo pipefail

echo "🤖 DemoTradePro Agent Auth0 Configuration Update"
echo "================================================"

# Get the script directory
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

echo ""
echo "Step 1: Apply Terraform Changes..."
echo "---------------------------------"
cd terraform
terraform apply -auto-approve

echo ""
echo "Step 2: Regenerate Agent Environment File..."
echo "--------------------------------------------"
cd ../scripts
echo "Updating Agent App environment..."
./generate-web-env.sh

echo ""
echo "✅ DemoTradePro Agent Auth0 Configuration Updated!"
echo "================================================"
echo ""
echo "🔄 Restart your agent to pick up any environment changes:"
echo "1. Agent app: cd ../apps/agent && pnpm dev"
echo ""
