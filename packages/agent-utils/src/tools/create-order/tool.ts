import { z } from 'zod'
import { tool } from 'ai'
import { zodToJsonSchema } from 'zod-to-json-schema'
import { DemoTradeProAPIClient } from '../../utils/api-client'
import type { Order, CreateOrderRequest } from '../../types/api'

/**
 * Create Order Tool
 * Place a new buy or sell order for stocks
 */

// Schema definition
export const CreateOrderSchema = z.object({
  userId: z.string().describe('User ID placing the order'),
  symbol: z.string()
    .min(1, 'Stock symbol is required')
    .max(10, 'Stock symbol must be 10 characters or less')
    .regex(/^[A-Z]+$/, 'Stock symbol must be uppercase letters only')
    .describe('Stock symbol (e.g., AAPL, GOOGL)'),
  type: z.enum(['buy', 'sell'])
    .describe('Order type: buy or sell'),
  quantity: z.number()
    .min(1, 'Quantity must be at least 1 share')
    .max(10000, 'Maximum 10,000 shares per order')
    .int('Quantity must be a whole number')
    .describe('Number of shares to trade'),
  price: z.number()
    .min(0.01, 'Price must be at least $0.01')
    .max(1000000, 'Maximum price is $1,000,000')
    .describe('Price per share in USD')
})

export type CreateOrderParams = z.infer<typeof CreateOrderSchema>

// Default handler implementation
export async function createOrderHandler(
  params: CreateOrderParams, 
  apiClient: DemoTradeProAPIClient
): Promise<Order> {
  
  const orderRequest: CreateOrderRequest = {
    symbol: params.symbol,
    type: params.type,
    quantity: params.quantity,
    price: params.price
  }
  
  const response = await apiClient.post<Order>('/orders', orderRequest)
  
  if (!response.success) {
    throw new Error(response.error?.message || 'Failed to create order')
  }
  
  return response.data!
}

// AI SDK v5 tool factory
export function createAISDKTool(apiClient: DemoTradeProAPIClient) {
  return tool({
    description: 'Place a new buy or sell order for stocks - DemoTradePro',
    inputSchema: CreateOrderSchema,
    execute: async ({ userId, symbol, type, quantity, price }) => createOrderHandler({ userId, symbol, type, quantity, price }, apiClient)
  })
}

// MCP tool factory
export function createMCPTool(apiClient: DemoTradeProAPIClient) {
  return {
    name: 'createOrder',
    description: 'Place a new buy or sell order for stocks - DemoTradePro',
    inputSchema: zodToJsonSchema(CreateOrderSchema),
    handler: (params: CreateOrderParams) => createOrderHandler(params, apiClient)
  }
}

// Convenience exports
export const schema = CreateOrderSchema
export const defaultHandler = createOrderHandler
