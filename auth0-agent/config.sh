#!/usr/bin/env bash
# Shared configuration for DemoTradePro Agent
# This file contains common configuration values that are used across
# multiple scripts and Terraform configurations.

# Agent Application Base URL
# Change this value to quickly update the agent's base URL across all configs
# NOTE: Do not include a trailing slash
export AGENT_BASE_URL="http://localhost:3003"

# For deployment, set your production Vercel URL instead
#export AGENT_BASE_URL="https://demo-trade-pro-agent.vercel.app"

# Derived values (do not modify these unless you know what you're doing)
export AGENT_CALLBACK_URL="${AGENT_BASE_URL}/auth/callback"
export AGENT_MCP_SERVER_URL="${AGENT_BASE_URL}"
export AGENT_MCP_RESOURCE_IDENTIFIER="${AGENT_BASE_URL}/mcp"