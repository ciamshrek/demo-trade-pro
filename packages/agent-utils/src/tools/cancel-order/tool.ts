import { z } from 'zod'
import { tool } from 'ai'
import { zodToJsonSchema } from 'zod-to-json-schema'
import { DemoTradeProAPIClient } from '../../utils/api-client'
import type { Order } from '../../types/api'

/**
 * Cancel Order Tool
 * Cancel an existing pending order
 */

// Schema definition
export const CancelOrderSchema = z.object({
  orderId: z.string()
    .min(1, 'Order ID is required')
    .describe('Unique order identifier to cancel'),
  userId: z.string().describe('User ID who owns the order')
})

export type CancelOrderParams = z.infer<typeof CancelOrderSchema>

// Default handler implementation
export async function cancelOrderHandler(
  params: CancelOrderParams, 
  apiClient: DemoTradeProAPIClient
): Promise<Order> {
  const response = await apiClient.delete<Order>(`/orders/${params.orderId}`)
  
  if (!response.success) {
    throw new Error(response.error?.message || `Failed to cancel order ${params.orderId}`)
  }
  
  return response.data!
}

// AI SDK v5 tool factory
export function createAISDKTool(apiClient: DemoTradeProAPIClient) {
  return tool({
    description: 'Cancel an existing pending order - DemoTradePro',
    inputSchema: CancelOrderSchema,
    execute: async ({ orderId, userId }) => cancelOrderHandler({ orderId, userId }, apiClient)
  })
}

// MCP tool factory
export function createMCPTool(apiClient: DemoTradeProAPIClient) {
  return {
    name: 'cancelOrder',
    description: 'Cancel an existing pending order - DemoTradePro',
    inputSchema: zodToJsonSchema(CancelOrderSchema),
    handler: (params: CancelOrderParams) => cancelOrderHandler(params, apiClient)
  }
}

// Convenience exports
export const schema = CancelOrderSchema
export const defaultHandler = cancelOrderHandler
