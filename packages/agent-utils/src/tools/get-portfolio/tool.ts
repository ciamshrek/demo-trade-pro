import { z } from 'zod'
import { tool } from 'ai'
import { zodToJsonSchema } from 'zod-to-json-schema'
import type { DemoTradeProAPIClient } from '../../utils/api-client'
import type { Portfolio } from '../../types/api'

/**
 * Get Portfolio Tool
 * Retrieve user portfolio holdings and performance data
 */

// Schema definition
export const GetPortfolioSchema = z.object({
  userId: z.string().describe('User ID to fetch portfolio for'),
  includeHistory: z.boolean().optional().describe('Include historical performance data')
})

export type GetPortfolioParams = z.infer<typeof GetPortfolioSchema>

// Default handler implementation
export async function getPortfolioHandler(params: GetPortfolioParams, apiClient: DemoTradeProAPIClient): Promise<Portfolio> {
  const response = await apiClient.get<Portfolio>('/portfolio')
  
  if (!response.success) {
    throw new Error(response.error?.message || 'Failed to fetch portfolio')
  }
  
  return response.data!
}

// AI SDK v5 tool factory
export function createAISDKTool(apiClient: DemoTradeProAPIClient) {
  return tool({
    description: 'Retrieve user portfolio holdings and performance data - DemoTradePro',
    inputSchema: GetPortfolioSchema,
    execute: async ({ userId, includeHistory }) => getPortfolioHandler({ userId, includeHistory }, apiClient)
  })
}

// MCP tool factory
export function createMCPTool(apiClient: DemoTradeProAPIClient) {
  return {
    name: 'getPortfolio',
    description: 'Get user portfolio with current positions and values - DemoTradePro',
    inputSchema: zodToJsonSchema(GetPortfolioSchema),
    handler: (params: GetPortfolioParams) => getPortfolioHandler(params, apiClient)
  }
}

// Convenience exports
export const schema = GetPortfolioSchema
export const defaultHandler = getPortfolioHandler
