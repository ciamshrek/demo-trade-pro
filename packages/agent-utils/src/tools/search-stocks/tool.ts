import { z } from 'zod'
import { tool } from 'ai'
import { zodToJsonSchema } from 'zod-to-json-schema'
import type { DemoTradeProAPIClient } from '../../utils/api-client'
import type { StockInfo } from '../../types/api'

/**
 * Search Stocks Tool
 * Search for stocks by name or symbol
 */

// Schema definition
export const SearchStocksSchema = z.object({
  query: z.string()
    .min(1, 'Search query is required')
    .max(100, 'Search query must be 100 characters or less')
    .describe('Search term for stock name or symbol'),
  limit: z.number()
    .min(1, 'Limit must be at least 1')
    .max(50, 'Maximum 50 results')
    .default(10)
    .describe('Maximum number of results to return (default: 10)')
})

export type SearchStocksParams = z.infer<typeof SearchStocksSchema>

// Default handler implementation
export async function searchStocksHandler(
  params: SearchStocksParams, 
  apiClient: DemoTradeProAPIClient
): Promise<StockInfo[]> {
  const queryParams = new URLSearchParams({
    q: params.query,
    limit: params.limit.toString()
  })
  
  const response = await apiClient.get<StockInfo[]>(`/stocks/search?${queryParams}`)
  
  if (!response.success) {
    throw new Error(response.error?.message || 'Failed to search stocks')
  }
  
  return response.data!
}

// AI SDK v5 tool factory
export function createAISDKTool(apiClient: DemoTradeProAPIClient) {
  return tool({
    description: 'Search for stocks by name or symbol - DemoTradePro',
    inputSchema: SearchStocksSchema,
    execute: async ({ query, limit = 10 }) => searchStocksHandler({ query, limit }, apiClient)
  })
}

// MCP tool factory
export function createMCPTool(handler: (params: SearchStocksParams) => Promise<StockInfo[]>) {
  return {
    name: 'searchStocks',
    description: 'Search for stocks by name or symbol - DemoTradePro',
    inputSchema: zodToJsonSchema(SearchStocksSchema),
    handler
  }
}

// Convenience exports
export const schema = SearchStocksSchema
export const defaultHandler = searchStocksHandler
