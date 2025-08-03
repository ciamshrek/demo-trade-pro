import { z } from 'zod'
import { tool } from 'ai'
import { zodToJsonSchema } from 'zod-to-json-schema'
import type { DemoTradeProAPIClient } from '../../utils/api-client'
import type { PortfolioHistory } from '../../types/api.js'

/**
 * Get Portfolio History Tool
 * Get historical portfolio performance data over time
 */

// Schema definition
export const GetPortfolioHistorySchema = z.object({
  userId: z.string().describe('User ID to fetch portfolio history for'),
  days: z.number()
    .min(1, 'Days must be at least 1')
    .max(365, 'Maximum 365 days of history')
    .default(30)
    .describe('Number of days of historical data to retrieve (default: 30)'),
  interval: z.enum(['daily', 'weekly', 'monthly'])
    .default('daily')
    .describe('Time interval for historical data points')
})

export type GetPortfolioHistoryParams = z.infer<typeof GetPortfolioHistorySchema>

// Default handler implementation
export async function getPortfolioHistoryHandler(
  params: GetPortfolioHistoryParams, 
  apiClient: DemoTradeProAPIClient
): Promise<PortfolioHistory[]> {
  const queryParams = new URLSearchParams({
    days: params.days.toString(),
    interval: params.interval
  })
  
  const response = await apiClient.get<PortfolioHistory[]>(`/portfolio/history?${queryParams}`)
  
  if (!response.success) {
    throw new Error(response.error?.message || 'Failed to fetch portfolio history')
  }
  
  return response.data!
}

// AI SDK v5 tool factory
export function createAISDKTool(apiClient: DemoTradeProAPIClient) {
  return tool({
    description: 'Get historical portfolio performance data over time - DemoTradePro',
    inputSchema: GetPortfolioHistorySchema,
    execute: async ({ userId, days = 30, interval = 'daily' }) => getPortfolioHistoryHandler({ userId, days, interval }, apiClient)
  })
}

// MCP tool factory
export function createMCPTool(handler: (params: GetPortfolioHistoryParams) => Promise<PortfolioHistory[]>) {
  return {
    name: 'getPortfolioHistory',
    description: 'Get historical portfolio performance data over time - DemoTradePro',
    inputSchema: zodToJsonSchema(GetPortfolioHistorySchema),
    handler
  }
}

// Convenience exports
export const schema = GetPortfolioHistorySchema
export const defaultHandler = getPortfolioHistoryHandler
