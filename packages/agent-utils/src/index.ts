/**
 * @workspace/agent-utils - DemoTradePro Agent Utilities Package
 * 
 * Comprehensive utilities for building AI agents, including:
 * - Tools compatible with Model Context Protocol (MCP) and AI SDK v5
 * - Prompts and prompt templates
 * - Shared types and utilities
 * 
 * Usage:
 * 
 * AI SDK v5:
 * ```typescript
 * import * as GetPortfolio from '@workspace/agent-utils/tools/get-portfolio'
 * const portfolioTool = GetPortfolio.createAISDKTool(GetPortfolio.defaultHandler)
 * ```
 * 
 * MCP Server:
 * ```typescript
 * import * as GetPortfolio from '@workspace/agent-utils/tools/get-portfolio'
 * const portfolioMCPTool = GetPortfolio.createMCPTool(GetPortfolio.defaultHandler)
 * ```
 */

// Individual tool exports
export * from './types/api'

// Utilities
export { createAPIClient } from './utils/api-client'
