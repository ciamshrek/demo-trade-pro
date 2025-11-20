import { z } from "zod";
import { tool } from "ai";
import { zodToJsonSchema } from "zod-to-json-schema";
import { DemoTradeProAPIClient } from "../../utils/api-client";
import type { Order } from "../../types/api";

/**
 * Get Order Status Tool
 * Check the status of a specific trading order
 */

// Schema definition
export const GetOrderStatusSchema = z.object({
  orderId: z
    .string()
    .min(1, "Order ID is required")
    .describe("Unique order identifier"),
});

export type GetOrderStatusParams = z.infer<typeof GetOrderStatusSchema>;

// Default handler implementation
export async function getOrderStatusHandler(
  params: GetOrderStatusParams,
  apiClient: DemoTradeProAPIClient
): Promise<Order> {
  const response = await apiClient.get<Order>(`/orders/${params.orderId}`);

  if (!response.success) {
    throw new Error(
      response.error?.message || `Failed to fetch order ${params.orderId}`
    );
  }

  return response.data!;
}

// AI SDK v5 tool factory
export function createAISDKTool(apiClient: DemoTradeProAPIClient) {
  return tool({
    description:
      "Get the status of a specific order by order ID - DemoTradePro",
    inputSchema: GetOrderStatusSchema,
    execute: async ({ orderId }) =>
      getOrderStatusHandler({ orderId }, apiClient),
  });
}

// MCP tool meta
export function getMCPToolMeta() {
  return {
    name: "getOrderStatus",
    description: "Check the status of a specific trading order - DemoTradePro",
    inputSchema: zodToJsonSchema(GetOrderStatusSchema),
  };
}

// Convenience exports
export const schema = GetOrderStatusSchema;
export const defaultHandler = getOrderStatusHandler;
